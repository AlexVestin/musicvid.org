import React, { PureComponent } from "react";
import Typography from "../modules/components/Typography";
import LayoutBody from "../modules/components/LayoutBody";
import exp from "./exp.PNG";
export default class Export extends PureComponent {
    render() {
        return (
            <LayoutBody margin marginBottom>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Export Tutorial
                </Typography>
                This page will briefly explain the settings of the export tab in
                the editor.
                <img src={exp} alt="The export tab" />
                <div>
                    <Typography
                        style={{ marginTop: 30 }}
                        variant="h6"
                        component="h6"
                    >
                        Time range
                    </Typography>
                    The first three settings have to do with exporting at a
                    certain time in the song.
                    <b>
                        The <i>Use custom time range</i> button must be checked
                        for this to be used
                    </b>
                    .
                    <Typography
                        style={{ marginTop: 15 }}
                        variant="h6"
                        component="h6"
                    >
                        File name
                    </Typography>
                    What name you want to save the video file as.
                    <Typography
                        style={{ marginTop: 15 }}
                        variant="h6"
                        component="h6"
                    >
                        fps
                    </Typography>
                    The number of frames per seconds you want your exported
                    video to have. <b>Highly recommended to use 60fps</b> for
                    the best result. This is because some items increment per
                    frame and not by timedelta, meaning they will look slower
                    with lower fps.
                    <Typography
                        style={{ marginTop: 10 }}
                        variant="h6"
                        component="h6"
                    >
                        preset
                    </Typography>
                    A value the encoder uses for encoding speed. As the names
                    tell faster presets are faster to encode, but results in
                    larger file sizes, and in some cases worse video quality.
                    For the web version <b>veryfast</b> is the recommended
                    setting and for the desktop <b>medium</b>.
                    <div style={{ marginTop: 5 }} />
                    Here is a video from Perfect Irony comparing the different
                    presets.
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 510, height: 280, marginTop: 15 }}>
                            <iframe
                                src={
                                    "https://www.youtube.com/embed/gTiL8fGRKxA"
                                }
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title="video"
                            />
                        </div>
                    </div>
                    Keep in mind that:
                    <ol>
                        <li>
                            A relatively low bitrate was used, and tweaking this
                            setting might have improved the quality for the
                            faster presets.
                        </li>
                        <li>
                            YouTube re-encodes the video so, especially the
                            slower presets, might not reflect the video quality
                            (but should be close enough)
                        </li>
                    </ol>
                    <div style={{ marginTop: 5 }} />
                    Timestamps for the presets: 0:07 Ultrafast, 1:06 Superfast,
                    2:07 Veryfast, 3:04 Faster, 4:04 Fast, 5:04 Medium, 6:04
                    Slow, 7:04 Slower.
                    <Typography
                        style={{ marginTop: 10 }}
                        variant="h6"
                        component="h6"
                    >
                        MBitRate
                    </Typography>
                    How many megabits per second the video should have. A higher
                    number increases the quality, but also the file size.{" "}
                    <a href="https://www.ezs3.com/public/What_bitrate_should_I_use_when_encoding_my_video_How_do_I_optimize_my_video_for_the_web.cfm">
                        Here
                    </a>{" "}
                    is a good link with more information.
                </div>

                <Typography
                    style={{ marginTop: 10 }}
                    variant="h6"
                    component="h6"
                >
                    startEncoding
                </Typography>
                Starts the encoding! If there licensed items a dialouge will show up informing you of this.
            </LayoutBody>
        );
    }
}
