import React, { Component } from "react";
import { getObjectFromLocal, getSession, setObjectToLocal } from "../utils";
import { Grid, Button, FormControl, Well, Row } from "react-bootstrap";
import Image from "../components/Image";
import moment from "moment";
export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      commenting: false,
      comment: ""
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const images = getObjectFromLocal("images");
    const post = images.find((image, index) => index == id);
    this.setState({
      post
    });
  }

  handleInputChange = event => {
    const { target } = event;
    const { value, name } = target;

    this.setState({
      [name]: value
    });
  };
  editComment = () => {
    this.setState({ commenting: true });
  };

  postComment = () => {
    const images = getObjectFromLocal("images");
    let updatedImages = [...images];
    const { id } = this.props.match.params;
    const { comment, post } = this.state;
    const { comments = [] } = post;
    let updatedPost = {
      ...post,
      comments: [{ comment, time: moment().valueOf() }, ...(comments || [])]
    };
    this.setState({
      post: updatedPost,
      commenting: false,
      comment: ""
    });
    updatedImages[id] = { ...updatedPost };
    setObjectToLocal("images", updatedImages);
  };

  disableCommentButton = () => {
    const { commenting } = this.state;
    return !commenting ? (
      <Button bsStyle="primary" onClick={this.editComment}>
        <i className="fas fa-plus-square" /> Add a Comment
      </Button>
    ) : (
      <Button disabled>
        <i className="fas fa-plus-square" /> Add a Comment
      </Button>
    );
  };

  handleKeyPress = event => {
    if (event.charCode == 13) {
      this.postComment();
    }
  };

  cancelComment = () => {
    this.setState({
      comment: "",
      commenting: false
    });
  };

  render() {
    const { post, commenting, comment } = this.state;
    console.log(post);

    return post ? (
      <div className="profileContainer">
        <Grid>
          <Image src={post.Image} className="singlePostImage" />
          <div className="centeredCommentBtn">
            {this.disableCommentButton()}
          </div>
          <Row>
            {commenting ? (
              <div>
                <FormControl
                  type="text"
                  name="comment"
                  value={comment}
                  placeholder="Write a beautiful comment"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                />
                <Button
                  bsStyle="primary"
                  className="pull-right postBtn"
                  onClick={this.postComment}
                >
                  Post
                </Button>
                <Button
                  bsStyle="danger"
                  className="pull-right postBtn cancelBtn"
                  onClick={this.cancelComment}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
          </Row>
          <Row>
            {post.comments &&
              post.comments.map((data, key) => (
                <Well key={key}>
                  <div className="commentUserFlex">
                    <div>
                      <img
                        src={getSession().imageUrl}
                        style={{
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%"
                        }}
                        alt="user_img"
                      />
                    </div>
                    <div className="leftMargin">
                      <label className="smallerText">
                        {getSession().firstName} says
                      </label>
                      <h4 className="actualComment">{data.comment}</h4>
                    </div>
                  </div>
                  <div className="date">
                    {moment(data.time).format("DD MMM, HH:MM")}
                  </div>
                </Well>
              ))}
          </Row>
        </Grid>
      </div>
    ) : (
      <div>Post Not Found</div>
    );
  }
}
