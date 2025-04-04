resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_db_instance" "main" {
  identifier           = "${var.project_name}-${var.environment}-db"
  engine              = "mysql"
  engine_version      = "8.0"
  instance_class      = var.instance_class
  allocated_storage   = 20
  storage_type        = "gp2"
  parameter_group_name = "default.mysql80"
  db_name             = var.db_name
  username            = var.db_username
  password            = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot    = true
  publicly_accessible    = false
  multi_az              = false
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
} 