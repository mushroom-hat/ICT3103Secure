import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCardById } from './cardsApiSlice'
import EditCardForm from './EditCardForm'

const EditCard = () => {
    const { id } = useParams()

    const card = useSelector(state => selectCardById(state, id))

    const content = card ? <EditCardForm card={card} /> : <p>Loading...</p>

    return content
}
export default EditCard;