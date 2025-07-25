![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-cin7

This is an n8n community node that lets you integrate Cin7 (DEAR Systems) inventory management with your n8n workflows.

Cin7 is a comprehensive inventory management system that helps businesses manage their stock, sales, customers, and more across multiple channels and locations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

### Option 1: Install via npm (Recommended)

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install** 
3. Enter `n8n-nodes-cin7` as the npm package name
4. Select **Install**

Alternatively, you can install it via npm:

```bash
npm install n8n-nodes-cin7
```

### Option 2: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/notscottsmith/n8n-nodes-cin7.git
   cd n8n-nodes-cin7
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Link the package globally:
   ```bash
   npm link
   ```

4. In your n8n installation directory, link the package:
   ```bash
   npm link n8n-nodes-cin7
   ```

### Option 3: Docker Installation

Use the provided Dockerfile to run n8n with the Cin7 node pre-installed:

```bash
# Build the Docker image
docker build -t n8n-with-cin7 .

# Run the container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8n-with-cin7
```

## Operations

### Products
- **Get All Products** - Retrieve all products from your Cin7 inventory
- **Get Product** - Get details of a specific product by ID

### Customers  
- **Get All Customers** - Retrieve all customers from your Cin7 system
- **Get Customer** - Get details of a specific customer by ID

### Sales
- **Get All Sales** - Retrieve all sales from your Cin7 system
- **Get Sale** - Get details of a specific sale by ID

### Triggers (Webhooks)
- **Product Created** - Triggers when a new product is created
- **Product Updated** - Triggers when a product is updated  
- **Customer Created** - Triggers when a new customer is created
- **Customer Updated** - Triggers when a customer is updated
- **Sale Order Created** - Triggers when a new sale order is created
- **Sale Order Updated** - Triggers when a sale order is updated

## Credentials

To use this node, you need to set up Cin7 API credentials:

### Prerequisites
1. You need an active Cin7 (DEAR Systems) account
2. API access must be enabled for your account

### Setting up API credentials
1. Log into your Cin7 account at https://inventory.dearsystems.com
2. Go to **Settings > API**
3. Generate an Application Key if you don't have one
4. Note down your Account ID and Application Key

### Configuring credentials in n8n
1. In n8n, go to **Credentials > New**
2. Search for "Cin7 API" and select it
3. Enter your credentials:
   - **Account ID**: Your Cin7 Account ID
   - **Application Key**: Your Cin7 Application Key
4. Test the connection and save

## Compatibility

- **Minimum n8n version**: 0.174.0
- **Node.js version**: 20.15 or higher
- **Tested with**: n8n versions 0.220.0+

## Usage

### Basic Product Retrieval
1. Add a Cin7 node to your workflow
2. Select **Product** as the resource
3. Choose **Get All** operation
4. Configure your credentials
5. Set pagination options if needed

### Setting up Webhooks
1. Add a Cin7 node to your workflow
2. Select **Trigger** as the resource
3. Choose **Webhook** operation
4. Select the event you want to listen for
5. Configure additional options like signature validation
6. Activate the workflow to register the webhook

### Filtering and Pagination
The node supports various filtering options:
- **Modified Since**: Get records modified after a specific date
- **Status Filtering**: Filter sales by status (Draft, Authorised, etc.)
- **Pagination**: Control the number of results returned

### Error Handling
The node includes built-in error handling and will provide meaningful error messages for common issues like:
- Invalid credentials
- Rate limiting
- Network connectivity issues
- Invalid parameters

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Cin7 API Documentation](https://dearinventory.docs.apiary.io/)
- [Cin7 API Authentication Guide](https://dearinventory.docs.apiary.io/#introduction/connecting-to-the-api)
- [GitHub Repository](https://github.com/notscottsmith/n8n-nodes-cin7)

## Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/notscottsmith/n8n-nodes-cin7/issues)
2. Review the Cin7 API documentation for parameter requirements
3. Ensure your API credentials have the necessary permissions
4. Verify your n8n version meets the minimum requirements

## License

[MIT](https://github.com/notscottsmith/n8n-nodes-cin7/blob/main/LICENSE)
