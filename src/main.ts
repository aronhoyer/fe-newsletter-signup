import { homePage } from './homePage';
import { successPage } from './successPage';
import './style.scss'

async function main() {
  // prevent trailing slashes to screw up our switch below
  const pathname = window.location.pathname.split("/").join("/")

  switch (pathname) {
    case "/":
      homePage()
      break;
    case "/success":
      successPage()
      break;
    default:
      break;
  }
}

window.addEventListener("load", main)
