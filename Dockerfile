FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

# Install unzip (needed by bun installer) + bun
RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package files and install
COPY package.json bun.lock ./
RUN bun install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["bun", "run", "src/index.ts"]
