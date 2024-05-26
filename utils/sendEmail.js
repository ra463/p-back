const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({
  path: "../config/config.env",
});

const sendSellerDetails = async (user, property) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const options = {
      from: process.env.EMAIL,
      to: property.seller.email,
      subject: `Buyer Details`,
      html: `<div
      class="container"
      style="font-family: 'Roboto', sans-serif; margin: 0 auto"
    >
      <div class="head" style="display: flex; justify-content: center">
      <h2 style="margin: 0px 10px;margin-left: 0px;padding: 10px;padding-top: 5px;padding-left: 0">
          Buyer is interested in your property
        </h2>
      </div>
      <div
        class="row"
        style="
              padding: 1rem 0;
              border-top: 1px solid #e5e5e5;
              border-bottom: 1px solid #e5e5e5;
            "
      >
        <div>
          <p style="font-weight: bold; padding: 0; margin: 0">
            Hey ${property.seller.firstName}, One of the buyer interested in your property. Here are his details:
          </p>
          <p style="padding: 0; margin: 0">
           <ul>
              <li>Name: ${user.firstName} ${user.lastName}</li>
              <li>Email: ${user.email}</li>
              <li>Phone: ${user.mobile}</li>
            </ul>
          </p>

          <p style="padding: 5px; margin: 0">
            If you haven't requested this mail, then please contact us on our helpline number <span style="font-weight: bold">+91-1234567890</span>.
          </p>
          <p
            style="
                  padding:5px;
                  padding-bottom: 0;
                  margin: 0;
                  color: #949090;
                  font-size: 0.8rem;
                "
          >
            Regards, Team <span style="color: #35B0FC">Rentify</span>
          </p>
        </div>
      </div>
    </div>`,
    };

    smtpTransport.sendMail(options, (err, res) => {
      if (err) return err;
      return res;
    });
  } catch (error) {
    console.log(err);
  }
};

const sendBuyerDetails = async (user, property) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Seller Details`,
      html: `<div
      class="container"
      style="font-family: 'Roboto', sans-serif; margin: 0 auto"
    >
      <div class="head" style="display: flex; justify-content: center">
      <h2 style="margin: 0px 10px;margin-left: 0px;padding: 10px;padding-top: 5px;padding-left: 0">
          Seller Details of the property you are interested in
      </div>
      <div
        class="row"
        style="
              padding: 1rem 0;
              border-top: 1px solid #e5e5e5;
              border-bottom: 1px solid #e5e5e5
            "
      >
        <div>
          <p style="font-weight: bold; padding: 0; margin: 0">
            Hey ${user.firstName}, One of the buyer interested in your property. Here are his details:
          </p>
          <p style="padding: 0; margin: 0">
           <ul>
              <li style="list-style-type: none;list-style: none">Name: ${property.seller.firstName} ${property.seller.lastName}</li>
              <li style="list-style-type: none;list-style: none">Email: ${property.seller.email}</li>
              <li style="list-style-type: none;list-style: none">Phone: ${property.seller.mobile}</li>
            </ul>
          </p>

          <p style="padding: 5px; margin: 0">
            If you haven't requested this mail, then please contact us on our helpline number <span style="font-weight: bold">+91-1234567890</span>.
          </p>
          <p
            style="
                  padding:5px;
                  padding-bottom: 0;
                  margin: 0;
                  color: #949090;
                  font-size: 0.8rem;
                "
          >
            Regards, Team <span style="color: #35B0FC">Rentify</span>
          </p>
        </div>
      </div>
    </div>`,
    };

    smtpTransport.sendMail(options, (err, res) => {
      if (err) return err;
      return res;
    });
  } catch (error) {
    console.log(err);
  }
};

module.exports = {
  sendBuyerDetails,
  sendSellerDetails,
};
