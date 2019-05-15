export default theme => ({
    license: {
        position: "absolute",
        left: "5%",
        bottom: "10%",
        textAlign: "left"
    },
    vidSrc: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        overflow: "hidden",
        transition: "opacity 3s ease-in-out;"
    },
    attrib: {
        position: "absolute",
        right: "5%",
        bottom: "10%",
        textAlign: "right",
        pointerEvents: "none"
    },
    link: {
        textDecoration: "none",
        color: "inherit",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 4,
        cursor: "pointer",
        pointerEvents: "auto",
        border: "none",
        borderRadius: "0.25em",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.3)"
        }
    },

    imageWrapper: {
        position: "relative",
        display: "block",
        padding: 0,
        borderRadius: 0,
        minHeight: 225,
        height: "40vh",
        [theme.breakpoints.down("sm")]: {
            width: "100% !important",
            height: 100
        },
        "&:hover": {
            zIndex: 1
        },
        "&:hover $imageBackdrop": {
            opacity: 0.15
        },
        "&:hover $imageMarked": {
            opacity: 0
        },
        "&:hover $imageTitle": {
            border: "4px solid currentColor"
        }
    },
    imageButton: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.common.white
    },
    imageSrc: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        objectFit: "cover"
    },
    imageBackdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.common.black,
        opacity: 0.5,
        transition: theme.transitions.create("opacity")
    },
    imageTitle: {
        position: "relative",
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`
    },
    imageMarked: {
        height: 3,
        width: 18,
        background: theme.palette.common.white,
        position: "absolute",
        bottom: -2,
        left: "calc(50% - 9px)",
        transition: theme.transitions.create("opacity")
    }
});