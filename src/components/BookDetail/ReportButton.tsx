// this engages a babel macro that does cool emotion stuff (like source maps). See https://emotion.sh/docs/babel-macros
import css from "@emotion/css/macro";
// these two lines make the css prop work on react elements
import { jsx } from "@emotion/core";
/** @jsx jsx */

import React from "react";
import { Book } from "../../model/Book";
import ReportIcon from "@material-ui/icons/Flag";
import { Link } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

export const ReportButton: React.FunctionComponent<{
    book: Book;
}> = (props) => (
    // <Button
    //     color="secondary"
    //     css={css`
    //         padding-left: 0 !important;
    //         justify-content: left !important;
    //         margin-top: 2px;
    //     `}
    //     onClick={() => alert("not implemented yet")}
    // >
    <Link
        color="secondary"
        target="_blank"
        rel="noopener noreferrer" // copied from LicenseLink
        css={css`
            flex-shrink: 1;
            margin-right: 20px !important;
            display: flex;
            align-items: center;
            margin-top: 10px !important;
        `}
        onClick={() => alert("not implemented yet")}
    >
        <ReportIcon
            css={css`
                margin-right: 3px;
            `}
        />
        <div>
            <FormattedMessage id="book.report" defaultMessage="Report" />
        </div>
    </Link>
);
