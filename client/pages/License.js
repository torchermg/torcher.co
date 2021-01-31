import React from "react";

import { useParams } from "react-router";

import { Corset } from "/components/common";
import Danger from "/components/Danger";
import constants from "/shared/constants";
import { licensesById } from "/shared/licenses";
import NotFound from "/pages/NotFound";

export default ({}) => {
	const { id } = useParams();

	const license = licensesById.get(id);

	if (!license) return <NotFound />;

	return (
		<Corset>
			<Danger src={license.htmlUrl} />
		</Corset>
	);
};
