import { Link } from "react-router";
import classes from './notFound.module.css';

const NotFound = () => {
  return (
    <div className={classes.container}>
     <p>Page not found.</p>
      <Link to="/" className="linkButton" >Go Back</Link>
    </div>
  )
}

export default NotFound;