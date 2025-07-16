import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-7 text-gray-200">
      <h1 className="mb-6 text-3xl font-bold text-white">
        Privacy Policy for KuraKey
      </h1>
      <p className="mb-4 italic">Effective Date: 07/15/2025</p>
      <p className="mb-4">
        At KuraKey, your privacy is important to us. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you use our website, game, and related services (collectively, the
        &quot;Service&quot;).
      </p>
      <ol className="space-y-6 list-decimal pl-6">
        <li>
          <h2 className="font-semibold text-white">Information We Collect</h2>
          <ul className="mt-3 pl-5 list-disc space-y-2">
            <li>
              <strong>Personal Information:</strong> When you create an account,
              we may collect information such as your username, email address,
              and password.
            </li>
            <li>
              <strong>Gameplay Data:</strong> We collect data on your
              interactions, progress, in-game achievements, items collected
              (e.g., KuraKeys), and cutscenes unlocked.
            </li>
            <li>
              <strong>Device and Usage Information:</strong> We may collect data
              about the device you use, IP address, browser type, and usage
              patterns.
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-white">
            How We Use Your Information
          </h2>
          <ul className="mt-2 ml-4 list-disc space-y-2">
            <li>To operate and improve KuraKey and its features</li>
            <li>To personalize your user experience and progression</li>
            <li>
              To send updates, announcements, or promotional messages (only with
              consent)
            </li>
            <li>
              To ensure safety, detect fraud, and enforce our Terms of Service
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-white">Sharing Your Information</h2>
          <p className="mt-2">
            We do not sell your personal data. We may share your information
            with trusted service providers to help us operate the Service,
            comply with legal obligations, or protect our rights.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">
            Cookies and Tracking Technologies
          </h2>
          <p className="mt-2">
            KuraKey may use cookies and similar tracking technologies to enhance
            your experience and collect usage data. You can control cookies
            through your browser settings.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Data Retention</h2>
          <p className="mt-2">
            We retain your information for as long as necessary to provide our
            services or as required by law.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Your Rights and Choices</h2>
          <p className="mt-2">
            You may update or delete your account information at any time
            through your account settings. If you have questions about your
            data, you can contact us at
            <span className="font-mono"> &lt;Insert Email&gt;</span>.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Children’s Privacy</h2>
          <p className="mt-2">
            KuraKey is not intended for users under the age of 13. If we learn
            that we have collected personal information from a child under 13,
            we will delete it promptly.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">
            Changes to This Privacy Policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with a revised effective date.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default PrivacyPolicyPage;
