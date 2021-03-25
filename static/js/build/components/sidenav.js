
function Sidenav(_ref) {
    var id = _ref.id;

    return React.createElement(
        "ul",
        { id: "main-slidenav", className: "sidenav" },
        React.createElement(
            "li",
            null,
            React.createElement(
                "div",
                { className: "user-view" },
                React.createElement(
                    "div",
                    { className: "background" },
                    React.createElement("img", { src: "/static/img/banner-team-office.png" })
                ),
                React.createElement(
                    "a",
                    { href: "#user" },
                    React.createElement("img", { className: "circle", src: "/static/img/user.png" })
                ),
                React.createElement(
                    "a",
                    { href: "#name" },
                    React.createElement(
                        "span",
                        { className: "white-text name" },
                        "John Doe"
                    )
                ),
                React.createElement(
                    "a",
                    { href: "#email" },
                    React.createElement(
                        "span",
                        { className: "white-text email" },
                        "jdandturk@gmail.com"
                    )
                )
            )
        ),
        React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#!" },
                React.createElement(
                    "i",
                    { className: "material-icons" },
                    "cloud"
                ),
                "First Link With Icon"
            )
        ),
        React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#!" },
                "Second Link"
            )
        ),
        React.createElement(
            "li",
            null,
            React.createElement("div", { className: "divider" })
        ),
        React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { className: "subheader" },
                "Subheader"
            )
        ),
        React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { className: "waves-effect", href: "#!" },
                "Third Link With Waves"
            )
        )
    );
}

export default Sidenav;