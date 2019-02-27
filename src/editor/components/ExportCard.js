import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    card: {
        display: "flex",
        height: "10%"
    },
    details: {
        display: "flex",
        flexDirection: "column",
        minWidth: 300
    },
    author: {
        display: "flex",
        flexDirection: "column",
        width: "30%",
        minWidth: 120,
        textAlign: "center"
    },
    content: {
        flex: "1 0 auto"
    },
    cover: {
        width: 151
    }
});

function MediaControlCard(props) {
    const { classes, item } = props;

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.cover}
                    image={item.imageUrl}
                    title="Live from space album cover"
                />

                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" >
                        {""}
                        </Typography>

                        {item.projectUrl &&
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            style={{textAlign: "left", textDecoration: "none", color: "inherit"}}
                        >
                            <a style={{color: "#333"}} href={item.projectUrl}>Project url</a>
                            </Typography>
                        }
                    </CardContent>
                </div>

                {item.authors.map(author => {
                    return (
                        <div className={classes.author} key={author.name}>
                            <CardContent className={classes.content}>
                                <Typography component="h5" variant="h5" style={{backgroundColor: "rgba(0,0,0,0.12)"}}>
                                    {author.name}
                                </Typography>
                                
                                {author.social1 &&<Typography
                                    variant="subtitle1"
                                    color="textSecondary"
                                    style={{textAlign: "center", textDecoration: "none", color: "inherit"}}
                                >
                                   <a style={{color: "#333"}} href={author.social1.url}>{author.social1.type}</a>
                                   
                                </Typography>
                                }

                                {author.social2 &&
                                <Typography
                                    variant="subtitle1"
                                    color="textSecondary"
                                    style={{textAlign: "center", textDecoration: "none", color: "inherit"}}
                                >
                                  <a style={{color: "#333"}} href={author.social2.url}>{author.social2.type}</a>
                                 </Typography>
                                }

                                {author.social3 &&
                                <Typography
                                    variant="subtitle1"
                                    color="textSecondary"
                                    style={{textAlign: "center", textDecoration: "none", color: "inherit"}}
                                >
                                  <a style={{color: "#333"}} href={author.social3.url}>{author.social3.type}</a>
                                 </Typography>
                                }
                            </CardContent>
                        </div>
                    );
                })}
            </Card>
        </React.Fragment>
    );
}

MediaControlCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MediaControlCard);
