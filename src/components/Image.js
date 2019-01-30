import React, { Component } from "react";
import Loader from "react-loader-spinner";
export default class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoading: true
    };
  }

  onImageLoad = () => {
    this.setState({
      imageLoading: false
    });
  };

  render() {
    const {
      src,
      className = "profileImage",
      alt = "Image not found",
      onClick = () => {}
    } = this.props;
    const { imageLoading = false } = this.state;

    return (
      <div>
        <img
          className={className}
          src={src}
          alt={alt}
          style={{ display: imageLoading ? "none" : "block" }}
          onLoad={this.onImageLoad}
          onError={this.onImageLoad}
          onClick={onClick}
        />
        {imageLoading ? (
          <div className="text-center">
            <Loader type="Oval" color="#ccc" height={40} width={40} />
          </div>
        ) : null}
      </div>
    );
  }
}
