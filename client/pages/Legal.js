import React from "react";

import { useParams } from "react-router";

import { Corset } from "/components/common";
import Danger from "/components/Danger";
import constants from "/shared/constants";
import NotFound from "/pages/NotFound";

export default ({}) => {
	const { id } = useParams();

	const legalHtmlUrl = constants.ASSETS.LEGAL[id];

	if (!legalHtmlUrl) return <NotFound />;

	return (
		<Corset>
			<Danger src={legalHtmlUrl} />
		</Corset>
	);
};
