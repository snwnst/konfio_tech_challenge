output "db_instance_endpoint" {
  description = "The connection endpoint"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_port" {
  description = "The database port"
  value       = aws_db_instance.main.port
}

output "db_instance_identifier" {
  description = "The RDS instance identifier"
  value       = aws_db_instance.main.identifier
}

output "db_instance_username" {
  description = "The master username for the database"
  value       = aws_db_instance.main.username
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.main.arn
}

output "db_security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.rds.id
} 