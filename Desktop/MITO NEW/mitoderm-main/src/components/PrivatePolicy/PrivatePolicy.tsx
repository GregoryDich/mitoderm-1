import { FC } from 'react';
import styles from './PrivatePolicy.module.scss';
import ModalContentWrapper from '../Shared/ModalContentWrapper/ModalContentWrapper';

export function getCurrentDate(separator = '.') {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${date}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${year}`;
}

const PrivatePolicy: FC = () => {
  return (
    <ModalContentWrapper>
      <h2 className={styles.title}>Privacy Policy for MitoDerm</h2>
      <span className={styles.date}>Effective Date: {getCurrentDate()}</span>
      <p className={styles.text}>
        Welcome to MitoDerm (the "Company," "we," "us," or "our"). We respect
        and value your privacy and are committed to safeguarding your personal
        information. This Privacy Policy ("Policy") explains how we collect,
        use, protect, and disclose information obtained through our website (the
        "Site"). It applies to all individuals who access or use our Site,
        regardless of their place of residence, and reflects our compliance with
        applicable laws and regulations, including, where relevant, the Israeli
        Protection of Privacy Law, 5741-1981, the European Union’s General Data
        Protection Regulation (GDPR), and other international data protection
        and privacy laws.
      </p>
      <p className={styles.text}>
        By using our Site, you acknowledge that you have read and understood
        this Policy and agree to the practices described herein. If you do not
        agree, please refrain from using our Site.
      </p>
      <p className={styles.text}> 1. Information We Collect </p>
      <p className={styles.text}>
        1.1 Personal Data: We may collect personal information that you
        voluntarily provide when interacting with our Site. Such information may
        include:
      </p>
      <p className={styles.text}>
        Contact Information: Your name, email address, telephone number, and
        other similar identifiers you provide when submitting forms, requests,
        or inquiries. Account-Related Information (if applicable): Credentials
        and any other information required for creating and maintaining an
        account or accessing certain services on the Site. 1.2 Technical Data:
        We may collect information automatically from your device, including:
      </p>
      <p className={styles.text}>
        Log Data: Internet Protocol (IP) addresses, browser types, operating
        systems, access times, pages viewed, and referring URLs. Cookies and
        Similar Technologies: Data collected through cookies, pixels, and other
        tracking technologies to enhance user experience, analyze usage, and for
        certain marketing activities (as described in Section 6). 1.3 Usage
        Data: We collect information regarding how you interact with our Site,
        such as the pages viewed, time spent on the Site, navigation patterns,
        and features used, to improve our services and user experience.
      </p>
      1.4 Marketing Preferences: If you opt-in to receive marketing
      communications, we may collect and store information regarding your
      preferences, including whether you have consented to receiving
      newsletters, promotions, or other marketing materials.
      <p className={styles.text}>
        We do not intentionally collect sensitive personal information (e.g.,
        health data, financial data) unless explicitly provided by you for a
        specified purpose and with your informed consent.
      </p>
      <p className={styles.text}>2. How We Use Your Data</p>
      <p className={styles.text}>
        We use the information we collect for the following purposes and on the
        following legal bases:
      </p>
      <p className={styles.text}>
        Service Provision and Customer Support: To respond to inquiries, process
        requests, improve our Site’s functionality, provide you with information
        or services, and carry out contractual obligations. Marketing and
        Communications: To send you newsletters, promotional materials, and
        other marketing communications, subject to your explicit consent or
        other lawful bases under applicable law. Analytics and Improvement: To
        analyze user behavior, measure engagement, conduct research, and improve
        our Site, products, and services. Legal and Regulatory Compliance: To
        comply with applicable laws, regulations, and industry standards,
        respond to lawful requests, enforce our terms, or protect our rights,
        property, and the safety of our users or third parties. Where required
        by law, we rely on your consent or other lawful bases such as the
        necessity to perform a contract or comply with legal obligations to
        process your personal data.
      </p>
      <p className={styles.text}>3. Data Sharing and Disclosure</p>
      <p className={styles.text}>
        We do not sell or rent your personal data. However, we may share your
        information under the following circumstances:
      </p>
      <p className={styles.text}>
        Service Providers and Business Partners: We may engage trusted
        third-party vendors, service providers, or contractors to perform
        certain services on our behalf, such as hosting, analytics, customer
        relationship management, payment processing, or marketing assistance.
        These providers are contractually obligated to protect your personal
        data and use it only for the purposes authorized by us, in accordance
        with this Policy and applicable law.
      </p>
      <p className={styles.text}>
        Compliance with Legal Obligations: We may disclose personal data if
        required or permitted by law, regulatory requirements, or pursuant to a
        lawful request by public authorities (including to meet national
        security or law enforcement requirements), or to protect our rights and
        the rights of others.
      </p>
      <p className={styles.text}>
        Business Transfers: In the event of a merger, acquisition,
        reorganization, bankruptcy, or sale of all or a portion of our assets,
        your personal data may be transferred as part of that transaction. We
        will notify you and take reasonable measures to ensure that any
        successor entity respects your rights and continues to process your
        personal data in accordance with this Policy.
      </p>
      <p className={styles.text}>4. Data Retention</p>
      <p className={styles.text}>
        We retain personal data only for as long as it is necessary to fulfill
        the purposes for which it was collected, as described in this Policy, or
        as required by applicable law. When data is no longer needed, we take
        steps to securely delete, anonymize, or otherwise render it
        inaccessible.
      </p>
      <p className={styles.text}>5. Your Rights</p>
      <p className={styles.text}>
        Subject to applicable law, you may have certain rights regarding your
        personal data, including:
      </p>
      <p className={styles.text}>
        Right of Access: The right to obtain confirmation as to whether or not
        we process your personal data and request a copy of the personal data we
        hold about you. Right to Rectification: The right to correct any
        inaccuracies in your personal data. Right to Erasure ("Right to be
        Forgotten"): The right to request that we delete your personal data if
        it is no longer necessary for the purpose it was originally collected,
        or if there is no lawful basis for retaining it. Right to Restrict
        Processing: The right to request that we limit the processing of your
        personal data under certain conditions. Right to Data Portability: The
        right to receive your personal data in a structured, commonly used, and
        machine-readable format, and to request the transfer of that data to
        another data controller where technically feasible. Right to Object: The
        right to object, on legitimate grounds, to the processing of your
        personal data, including for direct marketing purposes. Right to
        Withdraw Consent: If we process your personal data based on your
        consent, the right to withdraw that consent at any time without
        affecting the lawfulness of processing conducted prior to withdrawal. To
        exercise your rights, please contact us at info@mitoderm.com. We may
        request additional information to verify your identity and will endeavor
        to respond within the timeframes required by applicable law.
      </p>
      <p className={styles.text}>6. Cookies and Tracking Technologies</p>
      <p className={styles.text}>
        We use cookies and similar tracking technologies to enhance user
        experience, analyze Site usage, and, where permitted, provide targeted
        advertising. The types of cookies we use include:
      </p>
      <p className={styles.text}>
        Essential Cookies: Necessary for the operation of the Site, enabling
        core functionalities such as security, network management, and
        accessibility. Performance and Analytics Cookies: Help us understand how
        visitors interact with our Site, allowing us to improve functionality
        and user experience. Marketing and Advertising Cookies: Used to
        personalize marketing messages and track the effectiveness of our
        promotional campaigns, only with your explicit consent where required by
        law. You can manage your cookie preferences through your browser
        settings or our cookie preference tool, if available. For additional
        details, please see our Cookie Policy.
      </p>
      <p className={styles.text}>7. Data Security</p>
      <p className={styles.text}>
        We implement commercially reasonable technical, administrative, and
        organizational measures designed to protect your personal data against
        accidental or unlawful destruction, loss, alteration, unauthorized
        disclosure, or access. Despite these measures, no method of transmission
        over the Internet or electronic storage is entirely secure, and we
        cannot guarantee absolute security.
      </p>
      <p className={styles.text}>8. International Data Transfers</p>
      <p className={styles.text}>
        Your personal data may be transferred to and processed in countries
        other than your country of residence, including Israel and jurisdictions
        that may not provide the same level of data protection as your home
        country. In such cases, we take measures to ensure that your personal
        data receives an adequate level of protection, for instance by
        implementing appropriate contractual safeguards (such as EU Standard
        Contractual Clauses where required).
      </p>
      <p className={styles.text}>9. Third-Party Links</p>
      <p className={styles.text}>
        Our Site may contain links to third-party websites or resources that are
        not controlled or operated by us. This Policy does not apply to
        third-party websites. We encourage you to review the privacy policies of
        those third parties to understand their data handling practices before
        providing them with any personal data.
      </p>
      <p className={styles.text}>10. Updates to This Privacy Policy</p>
      <p className={styles.text}>
        We may update this Policy from time to time to reflect changes in our
        practices, legal requirements, or industry standards. When we make
        changes, we will revise the "Effective Date" at the top of this page.
        Your continued use of the Site after any changes to this Policy
        constitute acceptance of those changes. We encourage you to review this
        Policy periodically for the latest information on our privacy practices.
      </p>
      <p className={styles.text}>11. Contact Us</p>
      <p className={styles.text}>
        If you have any questions, concerns, or requests regarding this Policy
        or our data protection practices, please contact us at:
      </p>
      <p className={styles.text}>
        MitoDerm Email:
        <a href='mailto:info@mitoderm.com'> info@mitoderm.com</a>
      </p>
      <p className={styles.text}>
        We are committed to addressing any inquiries promptly and, where
        appropriate, working with you and regulators to resolve any dispute or
        concern.
      </p>
    </ModalContentWrapper>
  );
};

export default PrivatePolicy;
