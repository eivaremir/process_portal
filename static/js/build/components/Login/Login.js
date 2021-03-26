

function Login() {
    return React.createElement(
        "div",
        { className: "login-wrapper" },
        React.createElement(
            "div",
            { className: "login-container" },
            React.createElement(
                "h2",
                { style: { textAlign: "center" } },
                "Log In"
            ),
            React.createElement(
                "form",
                null,
                React.createElement(
                    "div",
                    { className: "input-field col s6" },
                    React.createElement("input", { id: "email", type: "text", className: "validate" }),
                    React.createElement(
                        "label",
                        { htmlFor: "email" },
                        "E-Mail"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "input-field col s6" },
                    React.createElement("input", { id: "password", type: "password", className: "validate" }),
                    React.createElement(
                        "label",
                        { htmlFor: "password" },
                        "Password"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "input-field submit-group" },
                    React.createElement("input", { id: "login_submit", type: "submit", value: "Log In", className: "waves-effect waves-light btn", style: { width: "100%" } })
                )
            )
        )
    );
}

export default Login;