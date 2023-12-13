
import { useState } from "react";
import type { Capability } from "sats-connect";
import { BitcoinNetworkType } from "sats-connect";
// import bitcoin from "bitcoinjs-lib";

type Props = {
  network: BitcoinNetworkType;
  capabilities: Set<Capability>;
};

const VerifyInscription = ({ network, capabilities }: Props) => {
  
  const [content, setContent] = useState<string>("");
  const [contentType, setContentType] = useState<string>("image/jpeg");

  const onVerifyInscriptionClick = async () => {
    try {
 
          const base64String = content ; 
          const raw = window.atob(base64String);
          const rawLength = raw.length;
          const array = new Uint8Array(new ArrayBuffer(rawLength));

          for (let i = 0; i < rawLength; i++) {
              array[i] = raw.charCodeAt(i);
          }

          // Compute the SHA256 hash
          const hashBuffer = await crypto.subtle.digest('SHA-256', array);
          const hashArray = Array.from(new Uint8Array(hashBuffer));

          const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          console.log('hash::', hash)
 

    } catch (error) {
      alert(`An error ocurred: ${error.message}`);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setContent("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const contentString = e.target?.result as string;
      if (!contentString) {
        return;
      }

      const base64String = contentString.split(",")[1];
      setContent(base64String);
    };
    reader.readAsDataURL(selectedFile);
  };

  if (!capabilities.has("createInscription")) {
    return (
      <div className="container">
        <h3>Verify file inscription</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h3>Verify file inscription</h3>
      <div>
        <p>
          <b>Content type</b>
          <br />
          <input value={contentType} onChange={(e) => setContentType(e.target.value)}
          />
        </p>
        <p>
          <b>Content</b>
          <br />
          {content}
          <br />
          <input type="file" onChange={onFileSelect} />
        </p>
        <button onClick={onVerifyInscriptionClick}>Verify inscription</button>
      </div>
    </div>
  );
};

export default VerifyInscription;
