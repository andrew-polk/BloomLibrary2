import React from "react";
import { PublisherBanner } from "./banners/PublisherBanner";
import { StandardPublisherGroups } from "./StandardPublisherGroups";
import { ExternalLink } from "./banners/ExternalLink";
import { ListOfBookGroups } from "./ListOfBookGroups";
import { BookGroup } from "./BookGroup";

export const SILLEADPage: React.FunctionComponent = () => {
    const filter = { bookshelf: "SIL LEAD" };
    const description = (
        <React.Fragment>
            <p>
                <ExternalLink href="https://www.sil-lead.org/">
                    SIL LEAD
                </ExternalLink>{" "}
                is a faith-based nonprofit helping local, community-based
                organizations use their own languages to improve their quality
                of life.
            </p>
        </React.Fragment>
    );
    return (
        <div>
            <PublisherBanner
                title="SIL LEAD"
                showTitle={false}
                filter={filter}
                logoUrl={`https://share.bloomlibrary.org/bookshelf-images/SIL%20LEAD.png`}
                collectionDescription={description}
            />
            <ListOfBookGroups>
                <StandardPublisherGroups filter={filter} />
                <BookGroup title="All books" filter={{ ...filter }} />
            </ListOfBookGroups>
        </div>
    );
};
