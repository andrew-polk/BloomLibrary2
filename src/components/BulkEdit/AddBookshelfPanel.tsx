import React from "react";
import { observer } from "mobx-react";
import { FilterHolder } from "./BulkEditPage";
import { BulkEditPanel } from "./BulkEditPanel";
import { AddBookshelfToAllBooksInFilter } from "./BulkChangeFunctions";
import { useGetBookshelvesByCategory } from "../../connection/LibraryQueryHooks";

export const AddBookshelfPanel: React.FunctionComponent<{
    filterHolder: FilterHolder;
    refresh: () => void;
    backgroundColor: string;
}> = observer((props) => {
    const bookshelves = useGetBookshelvesByCategory();
    return (
        <BulkEditPanel
            choices={bookshelves.map((b) => b.key)}
            panelLabel="Add Bookshelf"
            newValueLabel="New Bookshelf"
            actionButtonLabel="Add Bookshelf"
            performChangesToAllMatchingBooks={(
                filter,
                bookshelf,
                refreshWhenDone
            ) =>
                AddBookshelfToAllBooksInFilter(
                    filter,
                    bookshelf,
                    refreshWhenDone
                )
            }
            {...props}
        />
    );
});
