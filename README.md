# Project Setup and Configuration

This is a project that uses ExpressJs for backend and React for frontend.

For backend, we have decided to implement a MVC(view for react 🤣) pattern where we have external routes, and those external routes call a Controller that handles the logic. While inside the controller there will be call made to the Model which handle all database call and implementation.

## Setup Instructions

1. **Clone the repository:**
   ```
    git clone <repository-url>
    cd <repository-directory>
   ```
2. **Install dependencies:**
   Ensure you have Node.js installed. Then, run the following command to install required dependencies:
   `
	pnpm install
	`
3. **Create .env File:**
   Make sure to set up your environment variables in a **.env file** in the root directory of your project. Example:
   `
	PORT_HTTP=5002
	PORT_HTTPS=5001
	`
4. **Configure Database Connection:**
   Update the connectDB method in _config/db.js_ (currently commented out). This will establish the connection to your database. You can also add your db credentials in the **.env file**.
   `
	MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/mernbackend?retryWrites=true&w=majority
	MONGO_URI=mongodb://localhost:27017/
	JWT_SECRET=your_jwt_secret
	`
5. Run the Server:
   ```
   pnpm run dev
   ```

## SSL Configuration

> Which SSL setup method did you choose and why? Document your decision-making process in a short paragraph, highlighting any past experiences or expectations about each method.

I decided to used what we have already used in the class as it was already done. However, on my previous capstone, we have a feature in which a document is digitally signed. It is where I get to dabble private key and public a lot, and different kinds of encrpytion methods. I have used `node-forge` during that time as it offers different cryptography utilities. I believe that generating private and certificate for this class is also possible using that package.

> How do the headers you chose to implement enhance your app’s security? Document your rationale.

Helmet, one of the recommended node packages, already set default security parameters, when used. I have written a comment on the **server.js** to specify the default options.

```
// Default headers set by Helmet:
// 1. X-Content-Type-Options (nosniff) - Prevents browsers from MIME-sniffing the content.
// 2. X-Frame-Options (sameorigin) - Prevents clickjacking by allowing frames only from the same origin.
// 3. X-DNS-Prefetch-Control - Controls browser DNS prefetching. Default is 'off'.
// 4. Strict-Transport-Security (HSTS) - Enforces HTTPS connections to the server.
// 5. X-Permitted-Cross-Domain-Policies - Controls Adobe Flash/Acrobat content.
// 6. Referrer-Policy (no-referrer) - Controls the information sent in the `Referer` header.
// 7. Expect-CT - Enforces Certificate Transparency.
// 8. X-XSS-Protection - Enables browser's built-in XSS filtering for older browsers.
```

I decided to continue with the default settings as it help mitigate, and prevents malicious people to exploiting the website and using it in a way it was not intended to be used. By preventing browsers from MIME-sniffing (`X-Content-Type-Options`) and blocking clickjacking (`X-Frame-Options)`, these settings help safeguard content integrity and user interaction. Disabling DNS prefetching (`X-DNS-Prefetch-Control`) prevents unauthorized domain lookups. Additional headers like `X-Permitted-Cross-Domain-Policies` limit unauthorized content sharing, `Referrer-Policy` controls privacy in referral data, and `Expect-CT` ensures certificate transparency, maintaining trust in site’s SSL certificates. Lastly, enabling `X-XSS-Protection` protection reduces the risk of cross-site scripting attacks in older browsers, all contributing to a safer, more secure application.

> What was the most challenging part of setting up HTTPS and Helmet? Document how you resolved any issues.

The most challenging part is knowing each type of request header, and its usage. I have research how to it works and its purpose, and how does it help protect the website specifically the website we are currently building

## Caching Strategies

> Document your caching strategy choices and how they address performance and security needs. What trade-offs did you make?

We have decided to specifically Cache all GET request as this is a call return specific data from our website, unlike post which tend to have data manipulation done at the backend. We have decided to particulary focus our caching on User, Projects, and Blog routes. For data that is mostly requested from the database, we generally cached it for 5minutes while having 2 minutes revalidation window. For media files such as pictures,
we decided to put it 1 year, as it does not update as much as the data such as profile information. We also decided to cache the JS, CSS, and HTML files as those does not update as much the information from the database.

## Lessons Learned

With the First Phase of the project, we are immediately exposed to different web security application, and optimization techniques. Specifically, we learned a lot with configuring the request headers which have different effects and incredibly increases the robustness of the website. We are also new to various types of caching options and saw how flexible it can be, at the same time we are scared configuring it wrongly. We get to revisit MVC for ExpressJs, and even learned the a React project can be build and hosted directly on backend.
