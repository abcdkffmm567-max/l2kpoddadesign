const { onValueCreated } = require("firebase-functions/v2/database");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp({
  databaseURL: "https://l2k-top-up-store-default-rtdb.asia-southeast1.firebasedatabase.app"
});

exports.notifyAdminNewOrder = onValueCreated(
  {
    ref: "/orders/{orderKey}",
    instance: "l2k-top-up-store-default-rtdb",
    region: "asia-southeast1"
  },
  async (event) => {
    const order = event.data.val() || {};
    const orderKey = event.params.orderKey;
    const orderId = order.orderId || `L2KTP-${orderKey}`;

    const tokenSnap = await getDatabase().ref("adminNotificationTokens").once("value");
    const tokenData = tokenSnap.val() || {};

    const entries = Object.entries(tokenData)
      .filter(([, value]) => value && value.enabled !== false && value.token)
      .map(([key, value]) => ({ key, token: value.token }));

    if (!entries.length) {
      console.log("No enabled admin notification tokens.");
      return;
    }

    const customer = order.customerName || order.name || "Customer";
    const amount = order.total || order.totalPrice || order.price || "";
    const item =
      order.packageName ||
      (Array.isArray(order.items) && order.items.length ? order.items[0].name : "") ||
      order.game ||
      "Top Up";

    const title = "🛒 New L2K Order";
    const body =
      `${customer} placed ${orderId}` +
      (item ? ` • ${item}` : "") +
      (amount ? ` • LKR ${amount}` : "");

    // FCM supports max 500 targets per multicast request.
    const chunks = [];
    for (let i = 0; i < entries.length; i += 500) {
      chunks.push(entries.slice(i, i + 500));
    }

    for (const chunk of chunks) {
      const tokens = chunk.map(x => x.token);

      const response = await getMessaging().sendEachForMulticast({
        tokens,
        data: {
          title,
          body,
          orderId: String(orderId),
          orderKey: String(orderKey),
          url: "./admin.html"
        },
        webpush: {
          headers: { Urgency: "high" }
        }
      });

      const removals = [];
      response.responses.forEach((result, index) => {
        if (result.success) return;
        const code = result.error && result.error.code ? result.error.code : "";
        console.warn("FCM send failed:", code, result.error && result.error.message);

        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token" ||
          code === "messaging/invalid-argument"
        ) {
          removals.push(
            getDatabase().ref("adminNotificationTokens/" + chunk[index].key).remove()
          );
        }
      });

      if (removals.length) await Promise.allSettled(removals);
    }

    console.log(`Admin notification sent for ${orderId}.`);
  }
);
