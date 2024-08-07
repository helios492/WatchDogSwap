import React from "react";
import {
  FaBook,
  FaTelegram,
  FaGithub,
  FaDiscord,
  FaTwitter,
} from "react-icons/fa";
import { Popover } from "antd";
import { AimOutlined, ArrowRightOutlined } from "@ant-design/icons";

function Home() {
  const currentYear = new Date().getFullYear();

  const watchDogOnly = (
    <>
      <div className="watchPop">
        <div>
          <h3 className="popHead">WatchDog Secure Decentralized Exchange</h3>
          <div>
            <p>
              <b>WatchDogSwap</b> is a decentralized exchange that establishes
              an additional layer of security against <b>Honeypot</b> tokens.
            </p>
            <p>
              The <b>WatchDog Protocol</b> automatically reverts a trade if the
              token about to be swapped is a <b>Honeypot</b> token.
            </p>
            <p>
              This fail-safe is achieved by the <b>WatchDog Protocol</b>.
            </p>
            <p>
              The <b>WatchDog Protocol</b> serves as a <b>Honeypot</b> detection
              system implemented as an overlay between the swap router and the
              user.
            </p>
            <p>This ensures safer trading experience for our users.</p>
            <p>
              Simply put, <b>ALL</b> swaps to a <b>Honeypot</b> token will fail
              when using <b>WatchDogSwap</b>.
            </p>
          </div>
        </div>
        <br />
        <div>
          <h3 className="popHead">First in Web3</h3>
          <div>
            <p>
              <b>WatchDogSwap</b> is the first and <b>ONLY</b> decentralized
              exchange to implement this secure swap service.
            </p>
            <p>
              Our objective is to create a secure trade environment for both
              experienced and new traders in web3.
            </p>
          </div>
        </div>
        <div>
          <h4>
            Read our{" "}
            <a href="http://abhayfootball.000webhostapp.com/">Whitepaper</a>{" "}
          </h4>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="tradeBoxWelcome">
        <div className="welcomeBoxHeader">
          <h2>WatchDog Secure Swap</h2>
        </div>
        <p>
          <div>
            <div>
              If you have fallen victim to accidentally buying a <b>Honeypot</b>{" "}
              token.
            </div>
            <br></br>
            <div>
              If you have ever heard of <b>Honeypot</b> tokens.
            </div>
            <br></br>
            <div>
              If you are looking for a secure decentralized exchange that
              algorithmically stops you from buying a <b>Honeypot</b> token even
              if you don't know you are about to buy one.
            </div>
          </div>
          <div className="welcome">
            <h3>
              Welcome to <b>WatchDog Secure Swap</b>
            </h3>
          </div>
          <div className="welcomeTradeParagraph">
            <h3>
              Trade tokens without the fear of buying a <b>Honeypot</b> when you
              trade on WatchDog Secure Swap.
            </h3>
            <h4 className="dogg">
              More details here <ArrowRightOutlined />{" "}
              <Popover
                className="popCan"
                content={watchDogOnly}
                title=" "
                trigger="hover"
                placement="top"
              >
                <AimOutlined className="cog" />
              </Popover>
            </h4>
          </div>
        </p>
      </div>
      <div>
        <div className="footer-icons">
          <a href="https://gitbook.com">
            <FaBook />
          </a>
          <a href="https://github.com">
            <FaGithub />
          </a>
          <a href="https://discord.com">
            <FaDiscord />
          </a>
          <a href="https://twitter.com/WatchDogSwap">
            <FaTwitter />
          </a>
          <a href="https://telegram.com">
            <FaTelegram />
          </a>
        </div>
        <div className="footer-year">
          <p>
            &copy; {currentYear} <b>WatchDog Secure Swap</b>. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
