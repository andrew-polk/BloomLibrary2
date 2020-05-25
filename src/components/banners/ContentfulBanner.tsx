import css from "@emotion/css/macro";
import React, { useState } from "react"; // see https://github.com/emotion-js/emotion/issues/1156
// these two lines make the css prop work on react elements
import { jsx } from "@emotion/core";
/** @jsx jsx */

import { ImageCreditsTooltip } from "./ImageCreditsTooltip";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useContentful } from "react-contentful";
import { commonUI } from "../../theme";
import { Breadcrumbs } from "../Breadcrumbs";
export const ContentfulBanner: React.FunctionComponent<{
    id: string;
    // Usually the banner's title prevails over this. But for default banners the collection label, if supplied, wins.
    collectionLabel?: string;
}> = (props) => {
    const [gotData, setGotData] = useState(false);
    const { data, error, fetched, loading } = useContentful({
        contentType: "pageBanner",
        id: `${props.id}`,
        // default for "include' is "1", and with the current model, we only need to go 1 deep (to get the background image url)
        // include: 1
    });
    if (loading || !fetched) {
        return null;
    }

    if (error) {
        console.error(error);
        return (
            <p>
                Error ${error} looking for banner id = ${props.id}.
            </p>
        );
    }

    if (!data) {
        return <p>Could not retrieve the banner id ${props.id}.</p>;
    }

    const banner = (data as any).fields;
    // I don't know why this happens, but sometimes data comes back as a promise instead of
    // the actual data. Reproduction steps as of May 18 2020: Navigate from home page through
    // Enabling Writers to American University of Nigeria, then to the More page for level 1,
    // then click the Breadcrumb for American University of Nigeria. As the resulting page
    // is drawn, we get data here being a promise.
    // The gotData flag and calling setGotData here are  just a trick to re-render when the data
    // is really available.
    // This appears to be a bug in the useContentful code, and of course it could return a
    // promise more than once; but so far this has proved a sufficient work-around.
    if (!banner && (data as any).then) {
        (data as any).then(() => setGotData(true));
        return null;
    }
    const backgroundImage = banner?.bannerImage?.fields?.file?.url ?? "";
    const logoUrl = banner?.logo?.fields?.file?.url ?? undefined;
    const textColor = backgroundImage ? "white" : "black";

    const darkenBackgroundImageFraction = backgroundImage ? 0.4 : 0;
    const linkColor = backgroundImage ? "white" : commonUI.colors.bloomBlue;

    let bannerName = banner.name;
    const defaultBannerIds = [
        "Qm03fkNd1PWGX3KGxaZ2v",
        "7v95c68TL9uJBe4pP5KTN0",
        "7E1IHa5mYvLLSToJYh5vfW",
    ];
    if (defaultBannerIds.includes(props.id) && props.collectionLabel) {
        bannerName = props.collectionLabel;
    }

    //const titleLines = banner.Name;
    // const secondTitleLine =
    //     titleLines.length > 1 ? <div> {titleLines[1]}</div> : "";
    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;

                height: 300px;
                display: flex;

                a {
                    color: ${linkColor};
                    text-decoration: underline;
                    &:visited {
                        color: ${linkColor};
                    }
                }
                /* https://www.nngroup.com/articles/text-over-images/ */
                /* #contrast-overlay {
                    background-color: rgba(0, 0, 0, 0.4);
                } */
                background-size: cover;
                * {
                    color: ${textColor};
                }

                background-image: url(${backgroundImage});

                /* this can override any of the above*/
                ${banner.css}
            `}
        >
            <div
                id="contrast-overlay"
                css={css`
                    background-color: rgba(
                        0,
                        0,
                        0,
                        ${darkenBackgroundImageFraction}
                    );
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                `}
            >
                <Breadcrumbs />
                <div
                    css={css`
                        display: flex;
                        flex-direction: ${logoUrl ? "row" : "column"};
                    `}
                >
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={"logo for " + banner.name}
                            css={css`
                                height: 150px;
                                margin-right: 50px;
                                margin-left: 20px;
                            `}
                        />
                    )}
                    <div
                        css={css`
                            flex-grow: 2;
                            display: flex;
                            flex-direction: column;
                            color: white;
                        `}
                    >
                        {banner.hideTitle || (
                            <h1
                                css={css`
                                    font-size: 36px;
                                    margin-top: 0;
                                    /*flex-grow: 1; // push the rest to the bottom*/
                                `}
                            >
                                {bannerName}
                                {/* {titleLines[0]}
                        //{secondTitleLine} */}
                            </h1>
                        )}

                        <div
                            css={css`
                                font-weight: normal;
                                max-width: 600px;
                                margin-bottom: 10px;
                                overflow: auto;
                            `}
                        >
                            {documentToReactComponents(banner.blurb)}
                        </div>
                        <div
                            css={css`
                                margin-top: auto;
                                margin-bottom: 5px;
                                display: flex;
                                justify-content: space-between;
                                width: 100%;
                            `}
                        >
                            {/* <BookCount
                            message={props.bookCountMessage}
                            filter={props.filter}
                        /> */}
                            {/* just a placeholder to push the imagecredits to the right
                             */}
                            <div></div>
                            {/* there should always be imageCredits, but they may not
                        have arrived yet */}
                            {banner.imageCredits && (
                                <ImageCreditsTooltip
                                    imageCredits={documentToReactComponents(
                                        banner.imageCredits
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// export const SearchBanner: React.FunctionComponent<{
//     filter: IFilter;
// }> = props => {
//     return (
//         <div
//             css={css`
//                 background-color: ${commonUI.colors.bloomRed};
//                 color: whitesmoke;
//                 padding-bottom: 10px;
//                 padding-left: 20px;
//             `}
//         >
//             <Breadcrumbs />
//             <BookCount filter={props.filter} />
//         </div>
//     );
// };