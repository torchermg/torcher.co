import React from "react";
import useFetch from "use-http";
import styled from "styled-components";

import NotFound from "/pages/NotFound";
import { ForegroundA, Loading } from "/components/common";

const DangerContainer = styled.div`
	h1, h2, h3, h4, h5, h6 {
		font-family: ${props => props.theme.accentFont};
		color: ${props => props.theme.foreground};
	}
	strong {
		color: ${props => props.theme.foreground};
	}
	a {
		${ForegroundA.componentStyle.baseStyle.rules}
		${ForegroundA.componentStyle.rules}
	}
`;

export default ({src}) => {
	const { loading, error, data = [] } = useFetch(src, {}, []);

	if (loading) return <Loading />;

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	const markup = {__html: data};

	return (
		<DangerContainer dangerouslySetInnerHTML={markup}></DangerContainer>
	);
};
