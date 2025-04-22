import { useEffect } from "react";
import {GreenButton} from "../greenbutton/greenbutton"
import "./menubar.css"
import { RedButton } from "../redbutton/redbutton";


export default function menubar() {
  return (
    <menu>
        <GreenButton label= {'collection'}/>
        <RedButton label= {'Jokers'}/>
    </menu>
  )
}
