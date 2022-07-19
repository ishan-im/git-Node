import Link from 'next/link'
import classes from './Dashboard.module.css'


const Dashboard = ({userName, role}) => {

    return (
        <div className={classes.body}>

            <div className={classes.card}>
        <div className={classes.card__img}>
            <img src={`https://via.placeholder.com/90x90.png/293462/FFFFFF?text=${userName}`} alt={userName}/>
        </div>
        <div className={classes.card__name}>
            <h2>{userName}</h2>
        </div>
        <div className={classes.card__job}>
            <span>{role}</span>
        </div>
        
        <div className={classes.card__btn}>
            <Link href='/user/profile/update'>
            <button className={classes.card__btn_contact}>Update Profile</button>
            </Link>

            <Link href='/user/link/create'>
            <button className={classes.card__btn_contact}>Create Link</button>
            </Link>
        </div>
    </div>

        </div>
    )

}


export default Dashboard