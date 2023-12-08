import './Contacts.css'

export const Contacts = () => {
    return (
      <footer id="contact">
        <div className="content">
          <div className="left box">
            <div className="upper">
              <div className="topic">About us</div>
              <p>Streamline your coffee experience with our Coffee Ordering System. Customize, order, and enjoy your favorite brew hassle-free. It's coffee made easy!</p>
            </div>
            <div className="lower">
              <div className="topic">Contact us</div>
              <div className="phone">
                <a href="#"><i className="fas fa-phone-volume"></i>+007 9089 6767</a>
              </div>
              <div className="email">
                <a href="#"><i className="fas fa-envelope"></i>abc@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="middle box">
            <div className="topic">Our Services</div>
            <div><a href="#">Web Design, Development</a></div>
            <div><a href="#">Web UX Design, Reasearch</a></div>
            <div><a href="#">Web User Interface Design</a></div>
            <div><a href="#">Theme Development, Design</a></div>
            <div><a href="#">Mobile Application Design</a></div>
            <div><a href="#">Wire raming & Prototyping</a></div>
          </div>
          <div className="right box">
            <div className="topic">Subscribe us</div>
            <form action="#">
              <input type="text" placeholder="Enter email address" />
              <input type="submit" name="" value="Send" />
              <div className="media-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </form>
          </div>
        </div>
        <div className="bottom">
          <p>Copyright © 2020 <a href="#">CIS 1202</a> All rights reserved</p>
        </div>
      </footer>
    );
  }
  