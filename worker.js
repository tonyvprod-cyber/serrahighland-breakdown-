export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/submit" && request.method === "POST") {
      try {
        const d = await request.json();
        const s = (v) => Array.isArray(v) ? v.join(", ") : String(v || "");

        const currentVehicle = [d.year, d.make, d.model].filter(Boolean).join(" ");
        const tradeInfo = "Bank: " + s(d.bank) + " | Payoff: " + s(d.payoff) + " | Title in hand: " + s(d.Title) + " | Both keys: " + s(d["Both keys"]) + " | Desired value: " + s(d.value) + " | KBB ICO: " + s(d["KBB ICO"]);
        const financeGoals = "Down: " + s(d.down) + " | Monthly: " + s(d.pay);

        await env.DB.prepare(
          "INSERT INTO submissions (name, phone, email, current_vehicle, trade_info, vehicle_condition, vehicle_type, features_desired, preferred_colors, deal_type, term, annual_miles, finance_goals, full_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          s(d.name),
          s(d.phone),
          s(d.email),
          currentVehicle,
          tradeInfo,
          s(d.Condition),
          s(d.Type),
          s(d.Features),
          s(d.colors),
          s(d.Transaction),
          s(d.Term),
          s(d["Lease miles"]),
          financeGoals,
          JSON.stringify(d)
        ).run();

        return Response.json({ ok: true });
      } catch (e) {
        return Response.json({ ok: false, error: "Could not save" }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
