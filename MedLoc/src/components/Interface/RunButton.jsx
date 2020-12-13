import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	}
}));

export default function Runbutton (props){
	const classes = useStyles();
	const [btnNotReady, setBtnNotReady] = useState((props.loading || false))
	
	React.useEffect(() => {
		setBtnNotReady(props.loading || false);
	}, [props.loading])

	return (
		<div>
			{/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}
			<Button
				onClick={props.propsOnClick}
				variant='contained'
				color='primary'
				disabled={btnNotReady}
				className={classes.button}
				endIcon={btnNotReady ? <Icon>timer</Icon> : <Icon>send</Icon>}>
				Run
			</Button>
		</div>
	);
}
