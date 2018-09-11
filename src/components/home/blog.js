import React, {Component} from 'react';

import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@material-ui/core';

const extractParagraph = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  const paragraphs = el.getElementsByTagName('p');
  let text = "";
  if (paragraphs.length > 0) {
    let p = paragraphs[0];
    for (let child of p.children) {
      p.removeChild(child);
    }
    text = paragraphs[0].innerHTML;
  }
  el.remove();
  return text;
}

class BlogItem extends Component{
  render() {
    const { post } = this.props;
    const excerpt = extractParagraph(post.excerpt.rendered);
    return (
      <Card style={{marginBottom: '1rem'}}>
        <CardHeader
          title={post.title.rendered}
          subheader={(new Date(post.date)).toDateString()}
        />
        <CardContent style={{paddingTop: 0}}>
          <Typography dangerouslySetInnerHTML={{__html: excerpt}}/>
        </CardContent>
        <CardActions>
          <Button href={post.link} target="_blank"  color="primary">More</Button>
        </CardActions>
      </Card>
    )
  }
}

class BlogFeed extends Component {

  render() {
    const {posts} = this.props;
    if (!posts) {
      return null;
    }

    let blogItems = [];
    for (let post of posts) {
      blogItems.push(<BlogItem key={post.id} post={post} />);
    }

    return (
      <div>
        {blogItems}
      </div>
    )
  }
}

export default BlogFeed;
