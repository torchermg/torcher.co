export const checkName = (name) => {
	if (name) return;
	return "Please enter a name.";
};

const emailRe = /\S+@\S+\.\S+/;
export const checkEmail = (email) => {
	if (emailRe.test(email)) return;
	return "Please enter a valid email address.";
};
