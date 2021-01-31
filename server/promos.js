export const promos = [
	{
		code: "EASY10",
		discountRate: 0.1,
		start: Date.parse("2020-06-20"),
		end: null,
	},
	{
		code: "EASY20",
		discountRate: 0.2,
		start: Date.parse("2020-06-20"),
		end: Date.parse("2020-06-21"),
	},
];

export const isPromoActive = (promo) => {
	const now = new Date();
	if (promo.start && now < promo.start) return false;
	if (promo.end && now > promo.end) return false;
	return true;
};

export const byCode = new Map(promos.map((promo) => [promo.code, promo]));
