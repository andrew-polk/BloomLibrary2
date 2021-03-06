// this engages a babel macro that does cool emotion stuff (like source maps). See https://emotion.sh/docs/babel-macros
import css from "@emotion/css/macro";
// these two lines make the css prop work on react elements
import { jsx } from "@emotion/core";
/** @jsx jsx */

import React, { useContext } from "react";
import { Book } from "../../model/Book";
import { observer } from "mobx-react";
import { LicenseLink } from "./LicenseLink";
//NB: v3.0 of title-case has a new API, but don't upgrade: it doesn't actually work like v2.x does, where it can take fooBar and give us "Foo Bar"
import titleCase from "title-case";
import { Link, useTheme } from "@material-ui/core";
import { commonUI } from "../../theme";
import { BookStats } from "./BookStats";
import { CachedTablesContext } from "../../App";
import { getTagDisplayName } from "../../model/Tag";
import { useGetRelatedBooks } from "../../connection/LibraryQueryHooks";
import { Bookshelf } from "../../model/Bookshelf";
import { KeywordLinks } from "./KeywordLinks";
import { getAnchorProps } from "../../embedded";
import { FormattedMessage } from "react-intl";

export const MetadataGroup: React.FunctionComponent<{
    book: Book;
    breakToColumn: string;
}> = observer((props) => {
    const { bookshelves } = useContext(CachedTablesContext);
    const relatedBooks = useGetRelatedBooks(props.book.id);
    const theme = useTheme();
    return (
        <div
            id={"details"}
            css={css`
                display: flex;
                max-width: calc(100vw - ${commonUI.detailViewMargin}*2);
                @media (max-width: ${props.breakToColumn}) {
                    flex-direction: column-reverse;
                }
            `}
        >
            <div
                id="column1"
                css={css`
                    flex-grow: 1;
                `}
            >
                {props.book.level && (
                    <div>
                        <FormattedMessage
                            id="book.metadata.level"
                            defaultMessage="Level {levelNumber}"
                            values={{ levelNumber: props.book.level }}
                        />
                    </div>
                )}
                <div>
                    <FormattedMessage
                        id="book.metadata.pages"
                        defaultMessage="{count} Pages"
                        values={{ count: props.book.pageCount }}
                    />
                </div>
                <div>{props.book.copyright}</div>
                <div>
                    <FormattedMessage
                        id="book.metadata.license"
                        defaultMessage="License:"
                    />{" "}
                    <LicenseLink book={props.book} />
                </div>
                <div>
                    <FormattedMessage
                        id="book.metadata.uploadedBy"
                        defaultMessage="Uploaded {date} by {email}"
                        values={{
                            date: props.book.uploadDate!.toLocaleDateString(),
                            email: obfuscateEmail(props.book.uploader),
                        }}
                    />
                </div>
                <div>
                    <FormattedMessage
                        id="book.metadata.lastUpdated"
                        defaultMessage="Last updated on {date}"
                        values={{
                            date: props.book.updateDate!.toLocaleDateString(),
                        }}
                    />
                </div>
                {props.book.importedBookSourceUrl &&
                    props.book.importedBookSourceUrl.length > 0 && (
                        <div>
                            Imported from&nbsp;
                            <Link
                                color="secondary"
                                href={props.book.importedBookSourceUrl}
                            >
                                {new URL(props.book.importedBookSourceUrl).host}
                            </Link>
                        </div>
                    )}
                <BookStats book={props.book} />
            </div>
            <div
                id="column2"
                // This would be more concise using min-width. But we use max-width above.
                // If we mix the two, there is one pixel of width where they aren't consistent.
                css={css`
                    min-width: 300px;
                    float: right;
                    margin-left: 40px;
                    @media (max-width: ${props.breakToColumn}) {
                        float: inherit;
                        margin-left: 0;
                    }
                `}
            >
                <div>
                    <FormattedMessage
                        id="book.metadata.features"
                        defaultMessage="Features:"
                    />{" "}
                    {props.book.features
                        ? props.book.features
                              // Don't display the language-specific ones since we always have a generic one to go with it.
                              // e.g. We might have [blind, blind:en]. Only display "Blind."
                              .filter((f) => f.indexOf(":") < 0)
                              .map((f) => {
                                  return titleCase(f);
                              })
                              .join(", ")
                        : []}
                </div>
                <div>
                    <FormattedMessage
                        id="book.metadata.tags"
                        defaultMessage="Tags:"
                    />{" "}
                    {props.book.tags
                        .filter((t) =>
                            // Whitelist only these tags. So that removes system, bookshelf, level, computedLevel, etc.
                            ["topic", "region"].includes(t.split(":")[0])
                        )
                        .map((t) => {
                            return getTagDisplayName(t);
                        })
                        .join(", ")}
                </div>
                <div>
                    <FormattedMessage
                        id="book.metadata.keywords"
                        defaultMessage="Keywords:"
                    />{" "}
                    <KeywordLinks book={props.book}></KeywordLinks>
                </div>
                <div>
                    <FormattedMessage
                        id="book.metadata.bookshelves"
                        defaultMessage="Bookshelves:"
                    />{" "}
                    {props.book.bookshelves
                        .map(
                            (shelfKey) =>
                                Bookshelf.parseBookshelfKey(
                                    shelfKey,
                                    bookshelves
                                ).displayNameWithParent
                        )
                        .join(", ")}
                </div>
                {relatedBooks?.length > 0 && (
                    <div>
                        <FormattedMessage
                            id="book.metadata.related"
                            defaultMessage="Related Books:"
                        />{" "}
                        <ul
                            css={css`
                                margin: 0;
                            `}
                        >
                            {relatedBooks.map((b: Book) => {
                                return (
                                    <li key={b.id}>
                                        <Link
                                            css={css`
                                                color: ${theme.palette.secondary
                                                    .main} !important;
                                            `}
                                            {...getAnchorProps(`/book/${b.id}`)}
                                        >
                                            {b.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
});
function obfuscateEmail(user: any): string {
    const email = user.username;
    if (!email) {
        return "";
    }
    const index = email.lastIndexOf("@");
    if (index < 0 || index + 1 >= email.length) {
        return email;
    }
    return email.substring(0, index + 1) + "...";
}
