import React, { Component } from "react";
import Image from "./Image";
import moment from "moment";

export default class ImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false
    };
  }

  animate = () => {
    this.setState({ animate: true });
  };

  render() {
    const {
      src,
      className = "cardImage",
      content = "content",
      image = {},
      onLikeClick = () => {},
      onImageClick = () => {},
      onDeleteClick = () => {},
      onEditClick = () => {}
    } = this.props;
    const { liked } = image;
    const { animate } = this.state;

    return (
      <div className="card">
        <Image onClick={onImageClick} src={src} className={className} />
        <div className="commentFlex">
          <div>
            <i
              onMouseEnter={this.animate}
              onClick={onLikeClick}
              className={`${image.liked ? "red fas" : "far"} fa-heart cursor ${
                animate ? "animated tada" : ""
              }`}
            />
            {image.likes}
          </div>
          <div>
            <i className="far fa-trash-alt cursor" onClick={onDeleteClick} />
          </div>
          <div>
            <i className="fas fa-pencil-alt cursor" onClick={onEditClick} />
          </div>
        </div>
        <label className="font">Posted on :</label>
        <label>{moment(image.timestamp).format("DD MMM, HH:MM")}</label>
      </div>
    );
  }
}
