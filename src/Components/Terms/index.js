import React from "react";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";


const Terms = () => {
  return (
    <div className="w-[60%] mx-auto">
      <section>
        <h1 className="text-primary text-2xl text-center font-medium py-10">
          FundEzer Web App - Terms and Conditions
        </h1>
        <p className="text-primary py-4">These Terms and Conditions ("Terms") govern your access to and use of the FundEzer web application ("FundEzer" or the "Platform"), provided by FundEzer, a non-profit organization registered under Nigerian law, dedicated to addressing healthcare challenges in Africa and emerging markets. By accessing or using FundEzer, you agree to comply with these Terms. Please read them carefully before using FundEzer.
        </p>
      </section>
      <section>
        <p>
          <span className="font-bold">Acceptance of Terms:</span> : By accessing or using FundEzer, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access the Platform.
        </p>

        <p>
          <span className="font-bold">Use of FundEzer: </span>
          FundEzer is a medical crowdfunding platform designed to connect patients in Africa with voluntary donors worldwide to cover the expenses associated with critical medical interventions. You agree to use FundEzer only for its intended purpose and in compliance with all applicable laws and regulations.
        </p>

        <p>
          <span className="font-bold">User Accounts: </span>{" "}
          In order to access certain features of FundEzer, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process.

        </p>

        <p>
          <span className="font-bold">Donations:</span> FundEzer facilitates the collection of committees for specific medical cases. By making a donation through FundEzer, you agree to the terms and conditions of the donation, including any applicable processing fees. Donations are non-refundable.
        </p>

        <p>
          <span className="font-bold">Platform Content: </span> All content available on FundEzer, including but not limited to text, graphics, logos, images, and software, is the property of FundEzer or its licensors and is protected by intellectual property laws. You may not reproduce, modify, distribute, or otherwise use any content from FundEzer without prior written consent.
        </p>

        <p>
          <span className="font-bold">Privacy:</span> Your use of FundEzer is subject to FundEzer's Privacy Policy, which governs the collection, use, and disclosure of your personal information. By using FundEzer, you consent to the collection and use of your personal information in accordance with the Privacy Policy.

        </p>

        <p>
          <span className="font-bold">Third-Party Links:</span> FundEzer may contain links to third-party websites or services that are not owned or controlled by FundEzer. FundEzer assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that FundEzer shall not be responsible or liable, directly or indirectly, for any damage or loss projectd or alleged to be projectd by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
        </p>

        <p>
          <span className="font-bold">Disclaimer of Warranty: </span> FundEzer is provided on an "as-is" and "as available" basis, without any warranties of any kind, express or implied. FundEzer makes no representations or warranties regarding the accuracy, reliability, or availability of FundEzer or its content.

        </p>

        <p>
          <span className="font-bold">Limitation of Liability: </span> To the fullest extent permitted by applicable law, FundEzer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of FundEzer.

        </p>

        <p>
          <span className="font-bold">Indemnification: </span> You agree to indemnify and hold harmless FundEzer, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys' fees, arising out of or in connection with your use of FundEzer or your violation of these Terms.
        </p>

        <p>
          <span className="font-bold">Modification of Terms: </span>
          FundEzer reserves the right to modify or amend these Terms at any time without prior notice. Your continued use of FundEzer following the posting of any changes to these Terms constitutes acceptance of those changes.

        </p>
        <p>
          <span className="font-bold">Governing Law:</span>
          These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
        </p>
        <p>
          <span className="font-bold">By using FundEzer, you acknowledge that you have read, understood, and agree to be bound by these Terms.</span>
        </p>
      </section>
      <div className="flex justify-center gap-6 py-10">
        <Link to={`/signup?termStatus=${'agree'}`} className="fp">
          <Button label={"Accept"} />        </Link>
        <Link to="/" className="fp">
          <Button
            label={"Decline"}
          />
        </Link>
      </div>
    </div>
  );
};

export default Terms;
