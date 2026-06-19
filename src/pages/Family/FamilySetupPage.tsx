import React from "react";
import { useState } from 'react'
import CreateFamilyModal from '../../components/family/CreateFamilyModal'
import JoinFamilyModal from '../../components/family/JoinFamilyModal'
import FamilyManagementModal from '../../components/family/FamilyManagementModal'
import logo from "../../assets/nestledger_logo.svg";

export default function FamilySetupPage() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)
  const [openManage, setOpenManage] = useState(false)

  function handleCreated(familyId?: string) {
    console.log('[FamilySetupPage] onCreated called, familyId:', familyId)
    setOpenManage(true)
  }
  console.log("openManage",openManage);
  
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
    padding: "40px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const wrapperStyle: React.CSSProperties = {
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
  };

  const heroStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "60px",
  };

  const iconBoxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 16px",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "18px",
    color: "#555",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    marginBottom: "40px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "2px solid #e8e4ff",
    borderRadius: "20px",
    padding: "40px 30px",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const cardIconBoxStyle = (bgColor: string): React.CSSProperties => ({
    width: "60px",
    height: "60px",
    background: bgColor,
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  });

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 12px",
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    margin: "0 0 24px",
  };

  const featureListStyle: React.CSSProperties = {
    listStyle: "none",
    padding: "0",
    margin: "0 0 24px",
  };

  const featureItemStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#555",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  };

  const buttonStyle = (bgColor: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 20px",
    background: bgColor,
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "block",
    textAlign: "center",
    textDecoration: "none",
  });

  const infoStyle: React.CSSProperties = {
    background: "#f9f7ff",
    border: "1px solid #e8e4ff",
    borderRadius: "14px",
    padding: "20px",
    textAlign: "center",
  };

  const infoTextStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#555",
    margin: "0",
    lineHeight: "1.6",
  };

  const infoBoldStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#1a1a1a",
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Hero */}
        <div style={heroStyle}>
          <div style={iconBoxStyle}>
            <img
              src={logo}
              alt="NestLedger Logo"
              width="772px"
              height="72"
              className="brand-logo"
            />
          </div>
          <h1 style={titleStyle}>Welcome to NestLedger</h1>
          <p style={subtitleStyle}>
            Manage your family finances together. Start by creating a new family
            group or joining an existing one.
          </p>
        </div>

        {/* Cards */}
        <div style={gridStyle}>
          {/* Create Card */}
          <div
            style={cardStyle}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#94edb5";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 24px rgba(124, 58, 237, 0.12)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e8e4ff";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.05)";
            }}
          >
            <div style={cardIconBoxStyle("#94edb5")}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 style={cardTitleStyle}>Create a new family</h2>
            <p style={cardDescStyle}>
              Start fresh with a new family group. You'll be able to invite
              members and start tracking together right away.
            </p>
            <ul style={featureListStyle}>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#22c55e",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                Be the family admin
              </li>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#22c55e",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                Invite family members
              </li>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#22c55e",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                Full control and ownership
              </li>
            </ul>
              <div
                style={{ textDecoration: 'none' }}
                onClick={() => setOpenCreate(true)}
              >
                <div style={buttonStyle('#22c55e') as React.CSSProperties}>Create family</div>
              </div>
          </div>

          {/* Join Card */}
          <div
            style={cardStyle}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#b3d9f2";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 24px rgba(59, 130, 246, 0.12)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e8e4ff";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.05)";
            }}
          >
            <div style={cardIconBoxStyle("#bfe0ff")}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M16 11a2 2 0 11-4 0 2 2 0 014 0zM9 7a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 style={cardTitleStyle}>Join an existing family</h2>
            <p style={cardDescStyle}>
              Already have an invitation? Use the code from your family admin to
              join and start collaborating.
            </p>
            <ul style={featureListStyle}>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#3b82f6",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                Use an invitation code
              </li>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#3b82f6",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                See shared family budget
              </li>
              <li style={featureItemStyle}>
                <span
                  style={{
                    color: "#3b82f6",
                    marginRight: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                Log expenses together
              </li>
            </ul>
            <div
              style={{ textDecoration: 'none' }}
              onClick={() => setOpenJoin(true)}
            >
              <div style={buttonStyle('#3b82f6') as React.CSSProperties}>Join family</div>
            </div>
          </div>
        </div>
  <CreateFamilyModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={(familyId)=>handleCreated(familyId)} />
  <JoinFamilyModal open={openJoin} onClose={() => setOpenJoin(false)} />
  <FamilyManagementModal open={openManage} onClose={() => setOpenManage(false)} />

        {/* Info */}
        <div style={infoStyle}>
          <p style={infoTextStyle}>
            <span style={infoBoldStyle}>💡 Pro tip:</span> You can create or
            join multiple families if needed. Switch between them anytime from
            your dashboard.
          </p>
        </div>

        
      </div>
    </div>
  );
}
