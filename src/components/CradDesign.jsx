import React from "react";

// export default function CardDesign({n1,name3}) {
export default function CardDesign(props) {

    const name = "Pankaj"


    return(
        <>
        <div>
            {/* <h1>hello {name}</h1>
            <h1>hello {n1}</h1> */}
            <h1>hello {props.name2}</h1>
            {/* <h1>hello {name}</h1>
            <h1>hello {props.n1}</h1>
            <h1>hello {props.name3}</h1> */}
        </div>
        </>
    )
}

