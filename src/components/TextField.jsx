import PropTypes from "prop-types";
import { TextField as MuiTextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      textAlign: 'center',
      "& .MuiOutlinedInput-input": {
        padding: "0.25rem 0.5rem",
      },
      "& .MuiInputBase-root": {
        fontSize: "0.875rem",
      },
    },
  };
});

function TextField(props) {
  const {
    variant = "outlined",
    value,
    onChange = () => null,
    itemWidth = null,
    align = 'center',
    ...restProps
  } = props;

  const classes = useStyles({ itemWidth });

  return (
    <MuiTextField
      classes={{ root: classes.root }}
      value={value}
      onChange={onChange}
      variant={variant}
      style={{ width: itemWidth, textAlign: align }}
      {...restProps}
    />
  );
}

TextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  itemWidth: PropTypes.number,
  align: PropTypes.string,
};

export default TextField;
