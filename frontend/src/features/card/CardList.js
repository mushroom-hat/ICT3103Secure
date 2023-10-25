import { useGetCardsQuery } from "./cardApiSlice"
import Card from './Card'

const CardsList = () => {

    const {
        data: cards,
        isLoading,
        isSuccess,
        isError,
    } = useGetCardsQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content;

    if (isLoading) content = <p>Loading...</p>

    if (isError) content = <p>Not Currently Available</p>

    if (isSuccess) {
        const { ids } = cards;
        const tableContent = ids?.length
            ? ids.map(cardId => <Card key={cardId} cardId={cardId} />)
            : null;

        content = (
            <table className="table table--cards">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th card__number">Card Number</th>
                        <th scope="col" className="table__th card__name">Card Holder Name</th>
                        <th scope="col" className="table__th card__expiry">Expiry Date</th>
                        <th scope="col" className="table__th card__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;
}

export default CardsList;
