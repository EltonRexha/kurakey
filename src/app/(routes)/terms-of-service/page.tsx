import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-7 text-gray-200">
      <h1 className="mb-6 text-3xl font-bold text-white">
        Terms of Service for KuraKey
      </h1>
      <p className="mb-4 italic">Effective Date: 07/15/2025</p>
      <p className="mb-4">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of KuraKey, including any content, functionality, and services offered
        through the game or website (collectively, the &quot;Service&quot;).
      </p>
      <ol className="space-y-6 list-decimal pl-6">
        <li>
          <h2 className="font-semibold text-white">Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using KuraKey, you agree to be bound by these Terms.
            If you do not agree, do not use the Service.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Account Registration</h2>
          <p className="mt-2">
            You must create an account to access certain features. You are
            responsible for maintaining the confidentiality of your login
            information.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">User Conduct</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="pl-5 list-disc space-y-2 mt-3">
            <li>Violate any laws or regulations</li>
            <li>Interfere with the game’s functionality or other players</li>
            <li>Use bots, cheats, or unauthorized tools</li>
            <li>Post offensive, harmful, or unlawful content</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-white">
            Virtual Items and Progress
          </h2>
          <p className="mt-2">
            KuraKey may include collectible items and unlockable content. These
            items are for entertainment purposes only and hold no real-world
            monetary value.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Intellectual Property</h2>
          <p className="mt-2">
            All content, artwork, and code in KuraKey are owned by the
            developers. You may not reproduce or distribute any part of the
            Service without permission.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Termination</h2>
          <p className="mt-2">
            We may suspend or terminate your access if you violate these Terms
            or engage in behavior harmful to the community.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Disclaimer of Warranties</h2>
          <p className="mt-2">
            KuraKey is provided &quot;as is&quot; without warranties of any
            kind. We do not guarantee uninterrupted or error-free service.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, KuraKey is not liable for
            any indirect or incidental damages arising from your use of the
            Service.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Changes to the Terms</h2>
          <p className="mt-2">
            We may revise these Terms from time to time. Continued use of
            KuraKey constitutes acceptance of the updated Terms.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-white">Contact Us</h2>
          <p className="mt-2">
            For any questions about these Terms or our Privacy Policy, please
            contact us at
            <span className="font-mono"> &lt;Insert Email&gt;</span>.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default TermsOfServicePage;
