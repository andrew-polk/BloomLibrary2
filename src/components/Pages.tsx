// this engages a babel macro that does cool emotion stuff (like source maps). See https://emotion.sh/docs/babel-macros
import css from "@emotion/css/macro";
// these two lines make the css prop work on react elements
import { jsx } from "@emotion/core";
/** @jsx jsx */
import React, { useContext } from "react";
import { useGetTopicList } from "../connection/LibraryQueryHooks";
import { IFilter } from "../IFilter";
import { BookGroup } from "./BookGroup";
import { Breadcrumbs } from "./Breadcrumbs";
import { CustomizableBanner } from "./banners/CustomizableBanner";
import { getLanguageBannerSpec } from "./banners/LanguageCustomizations";
import { getProjectBannerSpec } from "./banners/ProjectCustomizations";
import { PublisherBanner } from "./banners/PublisherBanner";
// import { SearchBanner } from "./banners/Banners";
import { ListOfBookGroups } from "./ListOfBookGroups";
import { CachedTablesContext } from "../App";
import { getLanguageNamesFromCode } from "../model/Language";
import { LevelGroups, makeCollectionForLevel } from "./LevelGroups";
import { Bookshelf } from "../model/Bookshelf";
import { CollectionGroup } from "./CollectionGroup";
import {
    ICollection2,
    getCollectionData,
    useCollection,
    makeCollectionForSearch,
} from "../model/Collections";
import { useContentful } from "react-contentful";
import { makeCollectionForTopic, ByTopicsGroups } from "./ByTopicsGroups";

// export const SearchResultsPage: React.FunctionComponent<{
//     filter: IFilter;
// }> = (props) => {
//     let title = `Books matching "${props.filter.search!}"`;
//     if (props.filter.search!.indexOf("phash") > -1) {
//         title = "Matching Books";
//     }
//     return (
//         <React.Fragment>
//             <SearchBanner filter={props.filter} />
//             <ListOfBookGroups>
//                 <BookGroup title={title} filter={props.filter} rows={20} />
//             </ListOfBookGroups>
//         </React.Fragment>
//     );
// };

// I don't know if we'll stick with this... but for now this is what you get
// if there are lots of books and you scroll to the end of the 20 or so that
// we put in a row, and then you click on the MoreCard there to see the rest
export const AllResultsPage: React.FunctionComponent<{
    collectionName: string; // may have tilde's, after last tilde is a contentful collection urlKey
    filters: string; // may result in automatically-created subcollections. Might be multiple ones slash-delimited
}> = (props) => {
    const collectionNames = props.collectionName.split("~");
    const collectionName = collectionNames[collectionNames.length - 1];
    const { collection, error, loading } = useCollection(collectionName);
    if (loading) {
        return null;
    }

    if (error) {
        console.error(error);
        return null;
    }

    if (!collection) {
        return <p>Page does not exist.</p>;
    }

    let skip = 0;
    let subcollection = collection;
    if (props.filters) {
        for (const filter of props.filters.split("/")) {
            const parts = filter.split(":");
            switch (parts[0]) {
                case "level":
                    subcollection = makeCollectionForLevel(
                        subcollection,
                        parts[1]
                    );
                    break;
                case "topic":
                    subcollection = makeCollectionForTopic(
                        subcollection,
                        parts[1]
                    );
                    break;
                case "search":
                    subcollection = makeCollectionForSearch(
                        parts[1],
                        subcollection
                    );
                    break;
                case "skip":
                    skip = parseInt(parts[1], 10);
                    break;
            }
        }
    }
    const title = subcollection.richTextLabel;
    // The idea here is that by default we break things up by level. If we already did, divide by topic.
    // If we already used both, make a flat list.
    // This ignores any information in the collection itself about how it prefers to be broken up.
    // Possibly, we could use that as a first choice, then apply this heuristic if we're filtering
    // to a single aspect of that categorization already.
    // The other issue is that sometimes there aren't enough results to be worth subdividing more.
    // And it can be confusing if only one of the next-level categories has any content.
    // But at this stage we don't have access to a count of items in the collection, or any way to
    // know whether a particular way of subdividing them will actually break things up.
    let subList = <LevelGroups collection={subcollection} />;
    if ((props.collectionName + props.filters).indexOf("level:") >= 0) {
        subList = <ByTopicsGroups collection={subcollection} />;
        if ((props.collectionName + props.filters).indexOf("topic:") >= 0) {
            subList = (
                <CollectionGroup
                    title={title}
                    collection={subcollection}
                    rows={20}
                    skip={skip}
                />
            );
        }
    }
    return (
        <React.Fragment>
            <div
            // css={css`
            //     background-color: black;
            // `}
            >
                <Breadcrumbs />
            </div>
            {/* <SearchBanner filter={props.filter} /> */}
            <ListOfBookGroups>{subList}</ListOfBookGroups>
        </React.Fragment>
    );
};

export const DefaultOrganizationPage: React.FunctionComponent<{
    fullBookshelfKey: string;
}> = (props) => {
    const { bookshelves } = useContext(CachedTablesContext);
    const filter = { bookshelf: props.fullBookshelfKey };
    const title =
        Bookshelf.parseBookshelfKey(props.fullBookshelfKey, bookshelves)
            .displayName || "";
    return (
        <React.Fragment>
            <PublisherBanner
                title={title}
                showTitle={true}
                filter={filter}
                collectionDescription={<div />}
                // logoUrl={`https://share.bloomlibrary.org/bookshelf-images/African Storybook.png`}
            />

            <ListOfBookGroups>
                <BookGroup title={`All books`} filter={filter} />
            </ListOfBookGroups>
        </React.Fragment>
    );
};

export const LanguagePage: React.FunctionComponent<{
    langCode: string;
}> = (props) => {
    // console.assert(
    //     props.filter.language,
    //     "LanguagePage must have language set in the filter"
    // );
    const { collections } = useContext(CachedTablesContext);

    const { languagesByBookCount: languages } = useContext(CachedTablesContext);
    let languageDisplayName = getLanguageNamesFromCode(
        props.langCode!,
        languages
    )?.displayNameWithAutonym;
    if (!languageDisplayName) languageDisplayName = props.langCode;
    const filter = { language: props.langCode };
    return (
        <div>
            <CustomizableBanner
                filter={filter}
                title={languageDisplayName}
                spec={getLanguageBannerSpec(props.langCode!)}
            />

            {/* <ListOfBookGroups>
                <LevelGroups collection={collections.get("all")!} />
            </ListOfBookGroups> */}
        </div>
    );
};
export const ProjectPageWithDefaultLayout: React.FunctionComponent<{
    fullBookshelfKey: string;
}> = (props) => {
    //console.log("Project Page " + JSON.stringify(props));
    const { bookshelves } = useContext(CachedTablesContext);
    const filter = { bookshelf: props.fullBookshelfKey };
    const title =
        Bookshelf.parseBookshelfKey(props.fullBookshelfKey, bookshelves)
            .displayName || "";
    return (
        <React.Fragment>
            <CustomizableBanner
                filter={filter}
                title={title}
                spec={getProjectBannerSpec(props.fullBookshelfKey)}
            />
            <ListOfBookGroups>
                <BookGroup filter={filter} title={"All books"} rows={999} />
                {/* <BookGroupForEachTopic filter={props.filter} /> */}
            </ListOfBookGroups>
        </React.Fragment>
    );
};
export const CategoryPageWithDefaultLayout: React.FunctionComponent<{
    title: string;
    filter: IFilter;
}> = (props) => {
    return (
        <React.Fragment>
            <PublisherBanner
                filter={props.filter}
                title={props.title}
                showTitle={true}
                collectionDescription={<React.Fragment />}
            />
            <ListOfBookGroups>
                <BookGroup filter={props.filter} title={"All"} rows={20} />
            </ListOfBookGroups>
        </React.Fragment>
    );
};

export const CategoryPageForBookshelf: React.FunctionComponent<{
    fullBookshelfKey: string;
}> = (props) => {
    const { bookshelves } = useContext(CachedTablesContext);
    const filter = { bookshelf: props.fullBookshelfKey };
    const title =
        Bookshelf.parseBookshelfKey(props.fullBookshelfKey, bookshelves)
            .displayName || "";
    return <CategoryPageWithDefaultLayout title={title} filter={filter} />;
};
export const BookGroupForEachTopic: React.FunctionComponent<{
    filter: IFilter;
}> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { response, loading, error, reFetch } = useGetTopicList();
    if (response) {
        //console.log(response);
        return (
            <div key={props.filter.topic}>
                {response.data["results"].map((tag: any, index: number) => {
                    if (tag.name.split(":")[0] === "topic") {
                        const topic = tag.name.split(":")[1];
                        return (
                            <BookGroup
                                key={index}
                                title={`${topic} books`}
                                filter={{
                                    ...props.filter,
                                    ...{ topic },
                                }}
                            />
                        );
                    } else return null; //<></>;
                })}

                {/* TODO: currently the above will show some books as "NoTopic" books. But the vast majority of books without a topic
             do not have topic:NoTopic. There isn't an obvious way of writing a ParseServer query to get a subset of
             books (e.g. workshop) that also do not have any topics. We could a) do that on client b) custom function on server
             or c) walk the Library and insert "NoTopic" wherever it is missing.
            */}
            </div>
        );
    } else return null;
    // <React.Fragment key={"waiting"}>
    //     "waiting for topics"
    // </React.Fragment>
};
