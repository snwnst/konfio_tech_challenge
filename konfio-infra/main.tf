terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  environment          = var.environment
  project_name         = var.project_name
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  subnet_ids      = module.vpc.private_subnet_ids
  environment     = var.environment
  project_name    = var.project_name
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  vpc_id                 = module.vpc.vpc_id
  subnet_ids             = module.vpc.private_subnet_ids
  environment            = var.environment
  project_name           = var.project_name
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  instance_class         = var.db_instance_class
  eks_security_group_id  = module.eks.cluster_security_group_id
}

# Security Groups
module "security_groups" {
  source = "./modules/security_groups"

  vpc_id          = module.vpc.vpc_id
  environment     = var.environment
  project_name    = var.project_name
} 