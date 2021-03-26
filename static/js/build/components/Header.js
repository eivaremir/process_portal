
function Header() {
    return React.createElement(
        "nav",
        { className: "header" },
        React.createElement(
            "div",
            { className: "nav-wrapper" },
            React.createElement(
                "a",
                { href: "#", className: "brand-logo right" },
                React.createElement("img", { className: "logo", src: "/static/img/ZumaMarkets_black_backpng.png" })
            ),
            React.createElement(
                "ul",
                { id: "nav-mobile", className: "left hide-on-med-and-down" },
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: "sass.html" },
                        "Sass"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: "badges.html" },
                        "Components"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: "collapsible.html" },
                        "JavaScript"
                    )
                )
            )
        )
    );
}

export default Header;