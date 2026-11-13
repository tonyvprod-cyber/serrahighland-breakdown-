export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/submit" && request.method === "POST") {
      try {
        const d = await request.json();
        const features = Array.isArray(d.features_desired) ? d.features_desired.join(", ") : (d.features_desired || "");
        const colors = Array.isArray(d.preferred_colors) ? d.preferred_colors.join(", ") : (d.preferred_colors || "");

        await env.DB.prepare(
          "INSERT INTO submissions (name, phone, email, current_vehicle, trade_info, vehicle_condition, vehicle_type, features_desired, preferred_colors, deal_type, term, annual_miles, finance_goals) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          d.name || "",
          d.phone || "",
          d.email || "",
          d.current_vehicle || "",
          d.trade_info || "",
          d.vehicle_condition || "",
          d.vehicle_type || "",
          features,
          colors,
          d.deal_type || "",
          d.term || "",
          d.annual_miles || "",
          d.finance_goals || ""
        ).run();

        return Response.json({ ok: true });
      } catch (e) {
        return Response.json({ ok: false, error: "Could not save" }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
