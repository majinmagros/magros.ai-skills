#!/usr/bin/env node
/**
 * enroll-identities.js — Enroll all identities with Fabric CA.
 * 
 * Uso: node scripts/enroll-identities.js
 */

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const { FabricCAServices } = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CA_URL = 'https://localhost:7054';
const WALLET_PATH = path.join(__dirname, '../wallet');

async function enrollAdmin(wallet) {
    // Check if already enrolled
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
        console.log('✅ Admin already enrolled');
        return;
    }
    
    console.log('🔐 Enrolling admin...');
    
    const ca = new FabricCAServices(CA_URL);
    
    const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
    });
    
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toString());
    await wallet.import('admin', identity);
    console.log('✅ Admin enrolled successfully');
}

async function registerAndEnrollPeer(peerName, orgName, wallet) {
    console.log(`🔐 Registering and enrolling ${peerName}...`);
    
    const ca = new FabricCAServices(CA_URL);
    
    // Get admin identity
    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    
    // Register
    const registration = await ca.register({
        enrollmentID: peerName,
        enrollmentSecret: `${peerName}pw`,
        role: 'peer',
        affiliation: orgName.toLowerCase(),
        attrs: [
            { name: 'hf.Revoker', value: 'true', ecert: true },
            { name: 'hf.IntermediateCA', value: 'true', ecert: true }
        ]
    }, adminUser);
    
    // Enroll
    const enrollment = await ca.enroll({
        enrollmentID: peerName,
        enrollmentSecret: registration.secret
    });
    
    // Store in wallet
    const identity = X509WalletMixin.createIdentity(`${orgName}MSP`, enrollment.certificate, enrollment.key.toString());
    await wallet.import(peerName, identity);
    
    // Also save to crypto-config for peer
    const mspDir = path.join(__dirname, `../crypto-config/peerOrganizations/${orgName}.example.com/peers/${peerName}.${orgName}.example.com/msp`);
    if (!fs.existsSync(mspDir)) {
        fs.mkdirSync(mspDir, { recursive: true });
    }
    
    // Write certificates
    fs.writeFileSync(path.join(mspDir, 'signcerts', 'cert.pem'), enrollment.certificate);
    fs.writeFileSync(path.join(mspDir, 'keystore', 'key.pem'), enrollment.key.toString());
    
    // Copy CA certs
    const caCert = fs.readFileSync(path.join(__dirname, '../crypto-config/peerOrganizations', `${orgName}.example.com/ca/ca.crt`));
    fs.mkdirSync(path.join(mspDir, 'cacerts'), { recursive: true });
    fs.writeFileSync(path.join(mspDir, 'cacerts', 'ca-cert.pem'), caCert);
    
    console.log(`✅ ${peerName} enrolled and certificates saved`);
}

async function registerAndEnrollUser(userName, orgName, wallet) {
    console.log(`🔐 Registering and enrolling ${userName}...`);
    
    const ca = new FabricCAServices(CA_URL);
    
    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    
    // Register
    const registration = await ca.register({
        enrollmentID: userName,
        enrollmentSecret: `${userName}pw`,
        role: 'client',
        affiliation: orgName.toLowerCase(),
        attrs: [
            { name: 'hf.Registrar.Roles', value: 'peer,user', ecert: true }
        ]
    }, adminUser);
    
    // Enroll
    const enrollment = await ca.enroll({
        enrollmentID: userName,
        enrollmentSecret: registration.secret
    });
    
    const identity = X509WalletMixin.createIdentity(`${orgName}MSP`, enrollment.certificate, enrollment.key.toString());
    await wallet.import(userName, identity);
    
    console.log(`✅ ${userName} enrolled successfully`);
}

async function main() {
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║     FABRIC IDENTITIES ENROLLMENT              ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    
    // Create wallet
    const wallet = await new FileSystemWallet(WALLET_PATH);
    
    // 1. Enroll admin
    await enrollAdmin(wallet);
    
    // 2. Enroll peers for each org
    const orgs = [
        { name: 'org1', peers: ['peer0', 'peer1'] },
        { name: 'org2', peers: ['peer0', 'peer1'] }
    ];
    
    for (const org of orgs) {
        for (const peer of org.peers) {
            await registerAndEnrollPeer(peer, org.name, wallet);
        }
    }
    
    // 3. Enroll users
    await registerAndEnrollUser('user1', 'org1', wallet);
    await registerAndEnrollUser('user1', 'org2', wallet);
    
    console.log('\n✅ All identities enrolled successfully!');
    console.log('📁 Wallet location:', WALLET_PATH);
    console.log('📁 Certificates saved to crypto-config/');
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});