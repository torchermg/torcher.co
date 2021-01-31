export const checkName = name => {
	if (name) return;
	return "Name can't be empty!";
};

const emailRe = /\S+@\S+\.\S+/;
export const checkEmail = email => {
	if (emailRe.test(email)) return;
	return "Not a valid email address.";
};

export const checkCharityId = charityId => {
	if (charityId !== null) return;
	return "Select a charity, loser!";
}
