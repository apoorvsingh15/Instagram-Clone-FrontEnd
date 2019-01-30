import React from "react";
import { Button } from "react-bootstrap";
import Loader from "react-loader-spinner";

export default class LoadingButton extends React.Component {
  render() {
    const {
      loading = false,
      label,
      onClick,
      className = "",
      bsStyle = "primary"
    } = this.props;

    return (
      <Button
        onClick={onClick}
        bsStyle={bsStyle}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <Loader type="ThreeDots" color="#ccc" height={80} width={80} />
        ) : (
          label
        )}
      </Button>
    );
  }
}
