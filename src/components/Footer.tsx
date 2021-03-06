// this engages a babel macro that does cool emotion stuff (like source maps). See https://emotion.sh/docs/babel-macros
import css from "@emotion/css/macro";
// these two lines make the css prop work on react elements
import { jsx } from "@emotion/core";
/** @jsx jsx */
import SILLogo from "../assets/SIL.png";
import GitHubLogo from "../assets/GitHub-Mark-Light-32px.png";
import React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

//import { Link } from "react-router-dom";
export const Footer: React.FunctionComponent = () => {
    const l10n = useIntl();
    const location = useLocation();
    const hideFooter = location.pathname.startsWith("/player/");
    if (hideFooter) return <React.Fragment></React.Fragment>;
    const separator = (
        <span
            css={css`
                flex-shrink: 0; //https://css-tricks.com/couple-takes-sticky-footer/
                width: 20px;
                display: inline-block;
                text-align: center;
            `}
        >
            {"|"}
        </span>
    );

    const sil = (
        <a
            href="https://www.sil.org"
            rel="noopener"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            css={css`
                display: flex;
                * {
                    margin-top: auto;
                    margin-bottom: auto;
                }
            `}
        >
            <img
                src={SILLogo}
                alt={l10n.formatMessage({
                    id: "footer.silLogo",
                    defaultMessage: "SIL Logo",
                })}
            />
            <div
                css={css`
                    margin-left: 10px;
                `}
            >
                {"© 2020 SIL International"}
            </div>
        </a>
    );

    const github = (
        <a
            href="https://github.com/bloombooks"
            rel="noopener"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
        >
            <img
                css={css`
                    height: 32px !important;
                `}
                src={GitHubLogo}
                alt={l10n.formatMessage({
                    id: "footer.githubLogo",
                    defaultMessage: "Github Logo",
                })}
            />
        </a>
    );
    const contentful = (
        <a
            href="https://www.contentful.com/"
            rel="noopener"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            css={css`
                margin-left: auto;
            `}
        >
            <img
                src="https://images.ctfassets.net/fo9twyrwpveg/7Htleo27dKYua8gio8UEUy/0797152a2d2f8e41db49ecbf1ccffdaa/PoweredByContentful_DarkBackground_MonochromeLogo.svg"
                alt={l10n.formatMessage({
                    id: "footer.contentful",
                    defaultMessage: "Powered by Contentful",
                })}
            />
        </a>
    );
    return (
        <div
            css={css`
                padding: 20px;
                *,
                a,
                a:visited {
                    color: white !important;
                    text-decoration: none;
                }
                a {
                    display: flex;
                    height: 50px !important;
                }
                a *,
                span {
                    margin-top: auto !important;
                    margin-bottom: auto !important;
                }

                background-color: #525252;
            `}
        >
            {/* Top Row */}
            <div
                css={css`
                    height: 50px;
                    display: flex;
                `}
            >
                <BlorgLink href="/page/support">
                    <FormattedMessage
                        id="footer.support"
                        defaultMessage="Support"
                    />
                </BlorgLink>
                {separator}
                <BlorgLink href="/page/create/downloads">
                    <FormattedMessage
                        id="downloads"
                        defaultMessage="Downloads"
                    />
                </BlorgLink>
                {separator}
                <BlorgLink href="/page/termsOfUse">
                    <FormattedMessage
                        id="footer.terms"
                        defaultMessage="Terms of Use"
                    />
                </BlorgLink>
                {separator}
                <BlorgLink href="/page/privacyNotice">
                    <FormattedMessage
                        id="footer.privacy"
                        defaultMessage="Privacy Policy"
                    />
                </BlorgLink>
            </div>

            <div
                css={css`
                    display: flex;

                    a {
                        margin-right: 45px;
                    }
                    // sil logo on left, everything else from the right
                    a:first-of-type {
                        margin-left: 0;
                    }
                    // margin between them, all, but not needed for last item
                    *:last-child {
                        margin-right: 0;
                    }
                    img {
                        height: 40px;
                    }
                `}
            >
                {sil}
                {contentful}
                {github}
            </div>
        </div>
    );
};

const BlorgLink: React.FunctionComponent<{ href: string }> = (props) => {
    return (
        <Link
            // use the react-router link instead an an <a> element, so that we don't reload the page when we follow the href
            component={RouterLink}
            to={props.href}
        >
            <span>{props.children}</span>
        </Link>
    );
};
