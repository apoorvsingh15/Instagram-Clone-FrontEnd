import React, { Component, Fragment } from "react";
import { Grid, Row, Col, Modal, Button } from "react-bootstrap";
import {
  getSession,
  getObjectFromLocal,
  setObjectToLocal,
  blobToBase64
} from "../utils";
import ImageCard from "../components/ImageCard";
import Image from "../components/Image";
import axios from "axios";
import Dropzone from "react-dropzone";
import moment from "moment";
import { toast } from "react-toastify";

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      showDeleteConfirmation: false,
      selectedIndex: -1,
      showImageUpdate: false,
      file: null,
      preview: ""
    };
  }

  componentDidMount() {
    const images = getObjectFromLocal("images");
    this.setState({
      images
    });
  }

  onLikeClick = index => () => {
    const { images } = this.state;
    let updatedImages = [...images];
    let imageToUpdate = images[index];
    let { liked, likes } = imageToUpdate;
    if (liked) {
      likes -= 1;
    } else {
      likes += 1;
    }
    imageToUpdate = { ...imageToUpdate, liked: !liked, likes };
    updatedImages[index] = { ...imageToUpdate };
    this.setState({
      images: updatedImages
    });
    setObjectToLocal("images", updatedImages);
  };

  goToPost = index => () => {
    this.props.history.push(`/posts/${index}`);
  };

  onDelete = () => {
    const { images, selectedIndex = 0 } = this.state;
    let updatedImages = [...images];

    updatedImages.splice(selectedIndex, 1);

    this.setState({
      images: updatedImages
    });
    setObjectToLocal("images", updatedImages);
    this.toggleDeleteModal(-1)();
  };

  toggleDeleteModal = index => () => {
    this.setState(prevState => ({
      showDeleteConfirmation: !prevState.showDeleteConfirmation,
      selectedIndex: index
    }));
  };

  toggleImageUpdate = index => () => {
    this.setState(prevState => ({
      showImageUpdate: !prevState.showImageUpdate,
      selectedIndex: index
    }));
  };

  onDrop = files => {
    if (files.length) {
      blobToBase64(files[0]).then(res => {
        this.setState({
          file: files[0],
          preview: res
        });
      });
    } else {
      toast.error("Please upload correct file", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  updateImage = () => {
    const { images, selectedIndex, preview } = this.state;
    let updatedImages = [...images];
    if (selectedIndex == -1) {
      const image = {
        Image: preview,
        liked: false,
        comments: [],
        likes: 0,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      updatedImages = [image, ...(updatedImages || [])];
    } else {
      updatedImages[selectedIndex] = {
        ...updatedImages[selectedIndex],
        Image: preview
      };
    }
    this.setState({
      images: updatedImages,
      preview: "",
      file: null
    });
    setObjectToLocal("images", updatedImages);
    this.toggleImageUpdate(-1)();
  };

  addPost = () => {
    this.toggleImageUpdate(-1)();
  };

  render() {
    const {
      images = [],
      showDeleteConfirmation = false,
      showImageUpdate = false,
      file,
      selectedIndex,
      preview = ""
    } = this.state;
    const session = getSession() || {};

    const { imageUrl, firstName, lastName } = session;

    return (
      <Fragment>
        <div />
        <div className="profileContainer">
          <Grid>
            <div className="topHeaderFlex">
              <div>
                <Image
                  className="profileImage"
                  src={imageUrl}
                  alt="User_Image"
                />
              </div>
              <div>
                <div className="userVerified">
                  <h4 className="userFont">{`${firstName} ${lastName}`}</h4>
                  <i className="fas fa-check verifieDesign" />
                </div>
                <div className="staticData">
                  <div className="right">
                    <span className="boldText">2,074</span> posts
                  </div>
                  <div className="right">
                    <span className="boldText">3.2m</span> followers
                  </div>
                  <div className="right">
                    <span className="boldText">1</span> following
                  </div>
                </div>
              </div>
            </div>
            <div className="pull-right">
              <Button
                className="responsive"
                bsStyle="primary"
                onClick={this.addPost}
              >
                Add Post
              </Button>
            </div>
          </Grid>
        </div>
        <div className="profileContainer">
          <Grid>
            <Row>
              {images.map((image, key) => {
                return (
                  <Col key={key} lg={3} md={4} sm={6} xs={12}>
                    <ImageCard
                      image={image}
                      key={key}
                      src={image.Image}
                      onLikeClick={this.onLikeClick(key)}
                      onImageClick={this.goToPost(key)}
                      onDeleteClick={this.toggleDeleteModal(key)}
                      onEditClick={this.toggleImageUpdate(key)}
                    />
                  </Col>
                );
              })}
            </Row>
          </Grid>
        </div>
        <Modal
          show={showDeleteConfirmation}
          onHide={this.toggleDeleteModal(-1)}
        >
          <Modal.Header>
            <Modal.Title>Delete Post</Modal.Title>
          </Modal.Header>

          <Modal.Body>Are you sure you want to delete this post?</Modal.Body>

          <Modal.Footer>
            <Button onClick={this.toggleDeleteModal(-1)}>Close</Button>
            <Button bsStyle="danger" onClick={this.onDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showImageUpdate} onHide={this.toggleImageUpdate(-1)}>
          <Modal.Header>
            <Modal.Title>
              {selectedIndex == -1 ? "Add" : "Update"} Post
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Dropzone
              ref="dropzone"
              onDrop={this.onDrop}
              multiple={false}
              accept="image/*"
              className="dropzone"
            >
              <div className="dropzone-text">
                <p>Drop file here to upload</p>
              </div>
              {file && file.name ? (
                <p className="text-center">Selected file: {file.name}</p>
              ) : null}
            </Dropzone>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.toggleImageUpdate(-1)}>Close</Button>
            <Button
              disabled={!preview ? true : false}
              bsStyle="primary"
              onClick={this.updateImage}
            >
              {selectedIndex == -1 ? "Add" : "Update"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
